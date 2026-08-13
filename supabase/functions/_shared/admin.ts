import { createClient } from "npm:@supabase/supabase-js@2.112.3";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

export async function requireSuperadmin(req: Request) {
  const url = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  const secretKey = Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("Authorization");
  if (!url || !publishableKey || !secretKey || !authorization?.startsWith("Bearer ")) return null;

  const token = authorization.slice(7);
  const userClient = createClient(url, publishableKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false } });
  const adminClient = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user) return null;

  const { data: platformAdmin } = await adminClient.from("platform_admins").select("user_id").eq("user_id", authData.user.id).eq("active", true).maybeSingle();
  if (!platformAdmin) return null;

  return { user: authData.user, adminClient };
}
