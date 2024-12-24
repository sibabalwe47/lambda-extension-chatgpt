import { logger } from "./helpers.js";
import { start } from "./telemetry-server.js";
import { subscribe } from "./telemetry-api.js";
import { storeRequestId } from "./telemetry-store.js";
import { registerExtension, next } from "./extension-api.js";
import { sortLambdaTelemtryController } from "./telemetry-sort.js";

(async function main() {
  // 1. Register the extension to the Extensions API
  const extensionId = await registerExtension();

  // 2. Start local server to receive data from Telemetry API
  const telemetryListener = await start();

  // 3. Subscribe the extension for events from Lambda
  const subscribeForEvents = await subscribe(extensionId, telemetryListener);

  //4. Start logs analyser controller
  await sortLambdaTelemtryController();

  logger({
    message: "Extension reached ready state -",
    data: {
      extensionId,
      url: telemetryListener,
    },
    type: "INFO",
    show: true,
  });

  while (true) {
    // 4. Get next event from the queue
    const event = await next(extensionId);

    // Handle invoke event type
    if (event.eventType === "INVOKE") {
      storeRequestId(event);
    }

    // Handle shutdown event type
    if (event.eventType === "SHUTDOWN") {
      // Dispatch any failed metrics and shutdown the extension
      logger({
        message: "Lambda extension shutting down!",
        data: {},
        type: "INFO",
        show: true,
      });

      process.exit(0);
    }
  }
})();
