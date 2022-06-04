import { NextFunction, Request, Response } from "express";
import CustomError from "../../../errors/errors";
import GetLogger from "../../../logger/logger";

const logger = GetLogger();

const LoggingMiddleware = (
  data: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (data instanceof Error) {
    logger.error(data);
    let statusCode = 500;
    if (data instanceof CustomError) [(statusCode = data.statusCode)];
    res.status(statusCode).json({
      stauscode: statusCode,
      error: data.message,
    });
  } else {
    res.status(data.statusCode).json(data);
    logger.info({
      method: req.method,
      responseCode: res.statusCode,
      path: req.url,
    });
  }
};

export default LoggingMiddleware;
