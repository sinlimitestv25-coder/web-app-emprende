import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL("../supabase/migrations/20260813074000_platform_foundation.sql", import.meta.url);

test("enables RLS on every exposed application table", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  const tables = ["plans", "modules", "plan_modules", "platform_admins", "profiles", "tenants", "memberships", "tenant_modules", "audit_events"];
  for (const table of tables) assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security;`, "i"));
  assert.doesNotMatch(sql, /grant\s+all\s+on/i);
  assert.match(sql, /revoke all on[\s\S]+from anon;/i);
});

test("keeps tenant isolation in memberships and storage writes", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  assert.match(sql, /unique \(tenant_id, user_id\)/i);
  assert.match(sql, /m\.tenant_id::text = \(storage\.foldername\(name\)\)\[1\]/i);
  assert.match(sql, /catalog_assets_update_authorized[\s\S]+with check \([\s\S]+memberships/i);
  assert.match(sql, /Never store customer, order, product, sales or financial content here/i);
});

test("never places a Supabase secret in browser variables", async () => {
  const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");
  assert.doesNotMatch(envExample, /NEXT_PUBLIC_(SUPABASE_)?(SECRET|SERVICE_ROLE)/i);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
});
