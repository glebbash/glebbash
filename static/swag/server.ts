import express, { type Request, type Response } from "express";
import httpProxy from "http-proxy";

const app = express();

const proxy = httpProxy.createProxyServer({});
app.use("/proxy", (req: Request, res: Response) => {
  const targetUrl = req.url.slice(1); // Remove the leading '/'
  if (!targetUrl) {
    console.log(`Proxy request failed: Target URL is missing`);
    return res.status(400).send("Target URL is required");
  }

  console.log(`Proxying request to: [${req.method}] ${targetUrl}`);

  proxy.web(
    req,
    res,
    {
      target: targetUrl,
      changeOrigin: true,
      ignorePath: true,
    },
    (error: Error) => {
      console.error(
        `Proxy error: [${req.method}] (${req.res.statusCode}) ${targetUrl}: ${error.message}`,
      );
      res.status(500).send("Proxy error");
    },
  );
});

app.use(express.static("public"));

app.listen(3000);
