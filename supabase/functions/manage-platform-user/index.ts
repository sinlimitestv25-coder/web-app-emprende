import { corsHeaders, json, requireSuperadmin } from "../_shared/admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  const context = await requireSuperadmin(req);
  if (!context) return json({ error: "Acceso denegado" }, 403);

  const { action, userId, email } = await req.json() as { action: string; userId?: string; email?: string };
  if (!action || (!userId && !email)) return json({ error: "Solicitud inválida" }, 400);

  let operationError: Error | null = null;
  if (action === "reset_access" && email) {
    const { error } = await context.adminClient.auth.resetPasswordForEmail(email, { redirectTo: `${Deno.env.get("SITE_URL") ?? "http://localhost:3000"}/auth/update-password` });
    operationError = error;
  } else if (action === "resend_invite" && email) {
    const { error } = await context.adminClient.auth.admin.inviteUserByEmail(email, { redirectTo: `${Deno.env.get("SITE_URL") ?? "http://localhost:3000"}/auth/confirm` });
    operationError = error;
  } else if (action === "suspend" && userId) {
    const { error } = await context.adminClient.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
    operationError = error;
    if (!error) await context.adminClient.from("profiles").update({ status: "suspended" }).eq("id", userId);
  } else {
    return json({ error: "Acción no soportada" }, 400);
  }

  if (operationError) return json({ error: operationError.message }, 400);
  await context.adminClient.from("audit_events").insert({ actor_id: context.user.id, action: `user.${action}`, target_type: "user", target_id: userId ?? null, metadata: { email_domain: email?.split("@")[1] ?? null } });
  return json({ ok: true });
});
