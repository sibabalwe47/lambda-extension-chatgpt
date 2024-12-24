import fetch from "node-fetch";
import { logger } from "./helpers.js";
import {
  APPDYNAMCICS_API_KEY,
  APPDYNAMICS_ACCOUNT_NAME,
  APPDYNAMICS_URL,
} from "./config.js";
import * as datastore from "./data.js";

export const dispatchMetrics = async () => {
  try {
    // Filter out records with a missing BatchID (processed)
    const processedMetrics = datastore.state.telemetryStore.filter(
      (item) => item.BatchID != null
    );

    // If no processed metrics, log and exit
    if (processedMetrics.length === 0) {
      logger({
        message: "No processed metrics to dispatch.",
      });
      return;
    }

    logger({
      message: "AppD processed metrics collection",
      data: processedMetrics,
      type: "INFO",
    });

    logger({
      message: "Sending Lambda metrics to AppDynamics",
      type: "INFO",
      show: true,
    });
    const response = await fetch(`${APPDYNAMICS_URL}`, {
      method: "POST",
      headers: {
        "Content-type": "application/vnd.appd.events+json;v=2",
        Accept: "application/vnd.appd.events+json;v=2",
        "X-Events-API-AccountName": `${APPDYNAMICS_ACCOUNT_NAME}`,
        "X-Events-API-Key": `${APPDYNAMCICS_API_KEY}`,
      },
      body: JSON.stringify(processedMetrics),
    });

    const responseData = await response.text();

    logger({
      message: "AppDynamics request completed successfully!",
      type: "INFO",
      show: true,
    });

    // After dispatching, remove processed records from the telemetry store
    datastore.state.telemetryStore = datastore.state.telemetryStore.filter(
      (item) => item.BatchID == null
    );
  } catch (error) {
    logger({
      message: "AppDynamics request failed!",
      data: error,
      type: "INFO",
      show: true,
    });
  }
};
