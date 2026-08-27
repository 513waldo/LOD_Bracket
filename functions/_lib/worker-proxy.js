const DEFAULT_WORKER_API_BASE_URL = "https://lod-bracket-api.lod-bracket.workers.dev";

export function proxyWorkerRequest(context, pathname) {
  const { request, env } = context;
  const baseUrl = String(env?.LOD_BRACKET_API_BASE_URL || DEFAULT_WORKER_API_BASE_URL).replace(/\/$/, "");
  const target = new URL(`${baseUrl}${pathname}`);
  const headers = new Headers(request.headers);
  headers.delete("host");

  return fetch(new Request(target, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method.toUpperCase()) ? undefined : request.body,
    redirect: "manual",
  }));
}
