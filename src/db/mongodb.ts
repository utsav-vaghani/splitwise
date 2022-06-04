import { MongoClient } from "mongodb";
import cfg from "../configs/configs";
import GetLogger from "../logger/logger";

const client = new MongoClient(cfg.MongoDBURI);
const logger = GetLogger();

export function InitMongoDBClient() {
  client
    .connect()
    .then((client: any) => {
      client
        .db(cfg.DBName)
        .command({ ping: 1 })
        .then((client: any) => {
          logger.info(
            "connected with mongodb on %s/%s",
            cfg.MongoDBURI,
            cfg.DBName
          );
        });
    })
    .catch((err) => {
      logger.error(err);
    });
}

export const DB = client.db(cfg.DBName);
