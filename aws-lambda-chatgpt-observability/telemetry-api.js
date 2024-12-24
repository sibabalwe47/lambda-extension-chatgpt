import fetch from "node-fetch";
import { logger } from "./helpers.js";
import { TELEMETRY_BASE_URL } from "./config.js";

export const subscribe = async (extensionId, listenerUri) => {
  logger({
    message: `AppD extension subscribing to the Telemetry API.`,
    type: "INFO",
    show: true,
  });

  // Subscription body
  const subscription = {
    schemaVersion: "2022-07-01",
    destination: {
      protocol: "HTTP",
      URI: listenerUri,
    },
    types: ["platform", "function"],
    buffering: {
      timeoutMs: 1000,
      maxBytes: 256 * 1024,
      maxItems: 10000,
    },
  };

  const result = await fetch(TELEMETRY_BASE_URL, {
    method: "put",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
      "Lambda-Extension-Identifier": extensionId,
    },
  });

  if (result.status != 200) {
    logger({
      message: `AppD extension subscribing to the Telemetry API failed.`,
      type: "INFO",
      show: true,
    });
  } else {
    return result;
  }
};
