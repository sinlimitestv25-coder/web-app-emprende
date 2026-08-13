import { corsHeaders, json, requireSuperadmin } from "../_shared/admin.ts";

type Payload = {
  name: string;
  ownerName: string;
  email: string;
  phone?: string;
  plan: "base" | "team" | "trial";
  maxUsers: number;
  accentColor: string;
  modules: string[];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const context = await requireSuperadmin(req);
  if (!context) return json({ error: "Acceso denegado" }, 403);

  const payload = await req.json() as Payload;
  if (!payload.name?.trim() || !payload.ownerName?.trim() || !payload.email?.includes("@") || !Number.isInteger(payload.maxUsers) || payload.maxUsers < 1) {
    return json({ error: "Datos incompletos o inválidos" }, 400);
  }

  const slugBase = payload.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;
  const redirectTo = `${Deno.env.get("SITE_URL") ?? "http://localhost:3000"}/auth/confirm`;
  const { data: invite, error: inviteError } = await context.adminClient.auth.admin.inviteUserByEmail(payload.email.toLowerCase(), {
    redirectTo,
    data: { full_name: payload.ownerName.trim() },
  });
  if (inviteError || !invite.user) return json({ error: inviteError?.message ?? "No se pudo crear la invitación" }, 400);

  let createdTenantId: string | null = null;
  try {
    const { data: plan, error: planError } = await context.adminClient.from("plans").select("id, max_users").eq("code", payload.plan).eq("active", true).single();
    if (planError) throw planError;

    const { data: tenant, error: tenantError } = await context.adminClient.from("tenants").insert({
      name: payload.name.trim(), slug, owner_name: payload.ownerName.trim(), contact_email: payload.email.toLowerCase(), contact_phone: payload.phone?.trim() || null,
      plan_id: plan.id, max_users: Math.min(payload.maxUsers, plan.max_users), accent_color: payload.accentColor, created_by: context.user.id,
    }).select("id, public_id").single();
    if (tenantError) throw tenantError;
    createdTenantId = tenant.id;

    const { error: membershipError } = await context.adminClient.from("memberships").insert({ tenant_id: tenant.id, user_id: invite.user.id, role: "owner", status: "invited", invited_by: context.user.id });
    if (membershipError) throw membershipError;

    const { data: selectedModules, error: moduleError } = await context.adminClient.from("modules").select("id, name").in("name", payload.modules).eq("active", true);
    if (moduleError) throw moduleError;
    if (selectedModules?.length) {
      const { error } = await context.adminClient.from("tenant_modules").insert(selectedModules.map((module) => ({ tenant_id: tenant.id, module_id: module.id, configured_by: context.user.id })));
      if (error) throw error;
    }

    await context.adminClient.from("audit_events").insert({ actor_id: context.user.id, tenant_id: tenant.id, action: "tenant.created", target_type: "tenant", target_id: tenant.public_id, metadata: { plan: payload.plan, modules: payload.modules.length } });
    return json({ ok: true, tenantId: tenant.id, publicId: tenant.public_id });
  } catch (error) {
    if (createdTenantId) await context.adminClient.from("tenants").delete().eq("id", createdTenantId);
    await context.adminClient.auth.admin.deleteUser(invite.user.id);
    return json({ error: error instanceof Error ? error.message : "No se pudo aprovisionar el espacio" }, 500);
  }
});
