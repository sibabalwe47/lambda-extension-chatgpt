export const AWS_REGION = process.env.AWS_REGION;

export const DESTNATION_URL = process.env.DESTINATION_URL;

export const ANALYSE_INTERVAL = process.env.ANALYSE_INTERVAL || 10000;

export const DISPATCH_INTERVAL = process.env.DISPATCH_INTERVAL || 15000;

export const LAMBDA_EXTENSION_ENABLE_LOGS =
  process.env.LAMBDA_EXTENSION_ENABLE_LOGS &&
  process.env.LAMBDA_EXTENSION_ENABLE_LOGS == 1;

export const DEVELOPMENT_ENV = process.env.stage && process.env.stage == "dev";

export const BASE_URL = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`;

export const TELEMETRY_BASE_URL = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2022-07-01/telemetry`;
