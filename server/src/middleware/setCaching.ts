import { Request, Response, NextFunction } from "express";

export default function setCaching(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.url.endsWith(".js") || req.url.endsWith(".css")) {
    res.header("Cache-Control", "public, max-age=31536000");
  } else {
    res.header("Cache-Control", "no-store");
  }

  next();
}
