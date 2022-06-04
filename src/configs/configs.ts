import dotenv from "dotenv";

if (process.env.ENV === undefined) {
  dotenv.config({ path: "./src/configs/.env" });
} else {
  dotenv.config({ path: `./src/configs/${process.env.ENV}` });
}

export default {
  MongoDBURI: process.env.MONGO_DB_URI || "mongodb://localhost:27017",
  DBName: process.env.MONGO_DB_NAME || "dev",
  HTTPPort: process.env.HTTP_PORT || 8080,
  LogLevel: process.env.LOG_LEVEL || "info",
};
