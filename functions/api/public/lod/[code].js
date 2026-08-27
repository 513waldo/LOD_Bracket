import { proxyWorkerRequest } from "../../../_lib/worker-proxy.js";

export async function onRequest(context) {
  const code = String(context.params?.code || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);
  if (!code) {
    return new Response(JSON.stringify({ error: "Missing LOD code" }), {
      status: 400,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  return proxyWorkerRequest(context, `/api/public/lod/${encodeURIComponent(code)}`);
}
