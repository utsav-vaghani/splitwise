import bodyParser from "body-parser";
import express from "express";
import LoggingMiddleware from "./middlewares/logging";
import NotFoundHandler from "./middlewares/not-found-handler";
import routes from "./routes";

export default function (app: any) {
  // body parsing middlewares
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json());

  // registering routes
  Object.keys(routes)
    .map((key: string) => key as keyof typeof routes)
    .forEach((key) => {
      app.use(`${key}`, routes[key]);
    });

  // response handlers
  app.use(NotFoundHandler);
  app.use(LoggingMiddleware);
}
