import { NextFunction, Request, Response } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  console.log("heren");
  res.status(404).json({ path: req.url, message: "resource not found" });
  next();
}
