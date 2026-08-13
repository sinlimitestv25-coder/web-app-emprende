import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the protected Nexo v0.2 entry", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Nexo/);
  assert.match(html, /Superadministración/);
  assert.match(html, /Aislamiento por diseño/);
  assert.match(html, /Ver demostración de la v0\.2/);
  assert.doesNotMatch(html, /Todo en orden/);
  assert.doesNotMatch(html, /Ventas totales/);
  assert.doesNotMatch(html, /codex-preview/);
});
