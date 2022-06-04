import express from "express";
import cfg from "./configs/configs";
import { InitMongoDBClient } from "./db/mongodb";
import InitRestApp from "./delivery/rest/app";
import GetLogger from "./logger/logger";

const logger = GetLogger();

const app = express();

InitMongoDBClient();

InitRestApp(app);

app.listen(cfg.HTTPPort, () => {
  logger.info("listening on port: %d", cfg.HTTPPort);
});

process.on("SIGTERM", () => {
  logger.info("closing server gracefullynpm ");
});
