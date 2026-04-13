import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function send(
  response,
  statusCode,
  body,
  contentType = "text/plain; charset=utf-8",
) {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(body);
}

async function resolveFile(requestPath) {
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.join(rootDir, normalizedPath);
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    throw new Error("Not a file");
  }
  return filePath;
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const filePath = await resolveFile(url.pathname);
    const extension = path.extname(filePath);
    const contentType = mimeTypes[extension] ?? "application/octet-stream";
    const fileContent = await readFile(filePath);
    send(response, 200, fileContent, contentType);
  } catch {
    if (request.url === "/") {
      try {
        const html = await readFile(path.join(rootDir, "index.html"), "utf8");
        send(response, 200, html, "text/html; charset=utf-8");
        return;
      } catch {
        // fall through to 404
      }
    }

    send(response, 404, "Not found");
  }
});

const port = Number(process.env.PORT ?? 3000);

server.listen(port, () => {
  console.log(`Story Calculator web app running at http://localhost:${port}`);
});
