import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

let browserClient: SupabaseClient | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured) throw new Error("Supabase todavía no está configurado.");
  browserClient ??= createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return browserClient;
}

export async function requirePlatformAdmin() {
  const supabase = getSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return false;

  const { data, error } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .eq("active", true)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function provisionSpace(payload: Record<string, unknown>) {
  const { data, error } = await getSupabase().functions.invoke("provision-tenant", { body: payload });
  if (error) throw error;
  return data;
}

export async function managePlatformUser(payload: Record<string, unknown>) {
  const { data, error } = await getSupabase().functions.invoke("manage-platform-user", { body: payload });
  if (error) throw error;
  return data;
}
