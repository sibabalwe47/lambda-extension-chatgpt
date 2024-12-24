import fetch from "node-fetch";
import { logger } from "./helpers.js";
import { BASE_URL } from "./config.js";

export async function registerExtension() {
  logger({
    message: `Extension registering with Extensions API.`,
    show: true,
    type: "INFO",
  });
  const result = await fetch(`${BASE_URL}/register`, {
    method: "post",
    body: JSON.stringify({
      events: ["INVOKE", "SHUTDOWN"],
    }),
    headers: {
      "Content-Type": "application/json",
      "Lambda-Extension-Name": "appdynamics-metrics-extension",
    },
  });

  if (!result.ok) {
    logger({
      message: `Extension registering with Extensions API failed.`,
      show: true,
      type: "INFO",
    });
  } else {
    const extensionId = result.headers.get("lambda-extension-identifier");
    return extensionId;
  }
}

export const next = async (extensionId) => {
  const result = await fetch(`${BASE_URL}/event/next`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Lambda-Extension-Identifier": extensionId,
    },
  });
  if (!result.ok) {
    logger({
      message: `Extension fetching next event failed.`,
      show: true,
      type: "INFO",
    });
  } else {
    const event = await result.json();
    return event;
  }
};
