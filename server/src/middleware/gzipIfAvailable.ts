import { Request, Response, NextFunction } from "express";
import { existsSync } from "fs";
import { resolve } from "path";

export default function gzipIfAvailable(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const isJS = req.url.endsWith(".js");
    const isCSS = req.url.endsWith(".css");
    const acceptsGzip = req.headers["accept-encoding"].includes("gzip");
    const gzipFileExists = existsSync(
      resolve(__dirname, "../../client/dist" + req.url + ".gz")
    );

    if (isJS || isCSS) {
      if (acceptsGzip && gzipFileExists) {
        req.url = req.url + ".gz";
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", isJS ? "text/javascript" : "text/css");
      }
    }
  } catch (error) {
    console.error(error);
  }

  next();
}
