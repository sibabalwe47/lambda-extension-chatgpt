import express from "express";
import { logger } from "./helpers.js";
import { storeTelemetryMetricsFromLambdaService } from "./telemetry-store.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const LISTENER_HOST =
  process.env.AWS_SAM_LOCAL === "true" ? "0.0.0.0" : "sandbox.localdomain";
const LISTENER_PORT = 4243;

export const start = async () => {
  app.post("/", async (req, res) => {
    if (Object.keys(req.body).length > 0) {
      logger({
        message: `Metrics from Lambda service.`,
        data: req.body,
        type: "INFO",
      });
      storeTelemetryMetricsFromLambdaService(req.body);
    }
    res.send("OK");
  });

  const listerUrl = `http://${LISTENER_HOST}:${LISTENER_PORT}`;

  app.listen(LISTENER_PORT, LISTENER_HOST, () => {
    logger({
      message: `Extension server listening at ${listerUrl}`,
      type: "INFO",
    });
  });

  return listerUrl;
};
