import { cp, mkdir, writeFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

async function renderPage(pathname) {
  const response = await worker.fetch(
    new Request(`https://nexo.netlify.app${pathname}`, {
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
    throw new Error(`No se pudo generar ${pathname} (${response.status}).`);
  }

  return response.text();
}

await cp(new URL("../dist/client/", import.meta.url), new URL("../dist/", import.meta.url), {
  recursive: true,
  force: true,
});

await writeFile(new URL("../dist/index.html", import.meta.url), await renderPage("/"), "utf8");

// Pre-renderiza la vidriera pública de la tienda demo para que el enlace funcione
// como página estática propia, sin depender del catch-all de rutas desconocidas.
// Este slug debe coincidir siempre con defaultTenantDemo.portal.slug en app/data/tenant-demo.ts.
await mkdir(new URL("../dist/tienda/pensando-en-ti/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/tienda/pensando-en-ti/index.html", import.meta.url),
  await renderPage("/tienda/pensando-en-ti"),
  "utf8",
);

await writeFile(new URL("../dist/_redirects", import.meta.url), "/*  /index.html  200\n", "utf8");

console.log("Netlify export ready in dist/ (incluye /tienda/pensando-en-ti)");
