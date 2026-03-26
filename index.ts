import { readFileSync, readdirSync } from "node:fs";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";

const foldersWithIndexHtml = readdirSync("static", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const app = new Hono();

app.use("*", async (ctx, next) => {
  const url = new URL(ctx.req.url);
  const name = url.pathname.replace(/^\/|\/$/g, "");

  if (foldersWithIndexHtml.includes(name) && !url.pathname.endsWith("/")) {
    return ctx.redirect(`${url.pathname}/`, 301);
  }

  await next();
});

app.use(
  "/*",
  serveStatic({
    root: "./static",
    rewriteRequestPath: (path) => (path === "/" ? "/index.html" : path),
  }),
);

app.notFound((ctx) => {
  const html = readFileSync("./static/404.html", "utf-8");
  return ctx.html(html, 404);
});

serve(app, (info) => {
  console.log(`server started on port ${info.port}`);
});
