import { cp, writeFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("https://nexo.netlify.app/", {
    headers: { accept: "text/html" },
  }),
  {
    DB: {},
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`No se pudo generar la página estática (${response.status}).`);
}

await cp(new URL("../dist/client/", import.meta.url), new URL("../dist/", import.meta.url), {
  recursive: true,
  force: true,
});
await writeFile(new URL("../dist/index.html", import.meta.url), await response.text(), "utf8");
await writeFile(new URL("../dist/_redirects", import.meta.url), "/*  /index.html  200\n", "utf8");

console.log("Netlify export ready in dist/");
