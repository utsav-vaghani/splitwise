import bunyan, { ERROR, FATAL, INFO } from "bunyan";
import cfg from "../configs/configs";
const GetLogger = () => {
  let level: bunyan.LogLevel;

  switch (cfg.LogLevel) {
    case "INFO":
      level = "info";
    case "DEBUG":
      level = "debug";
    case "ERROR":
      level = ERROR;
    case "FATAl":
      level = FATAL;
    default:
      level = INFO;
  }

  return bunyan.createLogger({
    name: "splitwise",
    level: cfg.LogLevel as bunyan.LogLevelString,
  });
};

export default GetLogger;
