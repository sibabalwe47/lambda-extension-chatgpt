import { LAMBDA_EXTENSION_ENABLE_LOGS, DEVELOPMENT_ENV } from "./config.js";

export const logger = ({
  message,
  data = null,
  type = "INFO",
  show = false,
}) => {
  if (DEVELOPMENT_ENV || show || LAMBDA_EXTENSION_ENABLE_LOGS) {
    if (data != null) {
      console.log(
        `[${type}] (LambdaExtension) ${message}`,
        JSON.stringify({
          message,
          data,
        })
      );
    } else {
      console.log(`[${type}] (LambdaExtension) ${message}`);
    }
  }
};
