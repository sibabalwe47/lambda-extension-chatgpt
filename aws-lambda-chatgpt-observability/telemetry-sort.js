import * as datastore from "./data.js";
import { ANALYSE_INTERVAL } from "./config.js";
import { logger } from "./helpers.js";
import { updateRequestById } from "./telemetry-store.js";

export const sortLambdaTelemtryController = async () => {
  logger({
    message: `Logs controller started with an interval of ${
      ANALYSE_INTERVAL / 1000
    } seconds.`,
    type: "INFO",
    show: true,
  });

  const { sessionEventsQueue, requestBacklogIds } = datastore.state;

  const processLogs = async () => {
    if (requestBacklogIds.length === 0) {
      logger({ message: `No request IDs to process.` });
      return;
    }

    for (const requestId of requestBacklogIds) {
      try {
        // Extract start, log, and metrics data from Lamba API for this request
        const start = sessionEventsQueue.find(
          (s) => s.type == "platform.start" && s.record.requestId == requestId
        );
        const metrics = sessionEventsQueue.find(
          (m) => m.type == "platform.report" && m.record.requestId == requestId
        );

        const logs = sessionEventsQueue.filter(
          (l) => l.type == "function" && l.record.includes(requestId)
        );

        logger({
          message: `Extracted metrics for request ID: ${requestId}`,
          data: {
            start,
            metrics,
            logs,
          },
          type: "INFO",
        });

        if (logs.length == 0 && !start && !metrics) {
          logger({
            message: `Incomplete metrics found for request ID: ${requestId}. Skip procssing.`,
            type: "INFO",
          });

          updateRequestById(requestId, start, metrics, logs);

          continue;
        }
      } catch (error) {
        logger({
          message: `Error processing logs for request ID: ${requestId}`,
          data: { error: error.message, stack: error.stack },
          type: "ERROR",
        });
      }
    }
  };

  await processLogs();

  const startProcessing = async () => {
    await processLogs();
    setTimeout(startProcessing, ANALYSE_INTERVAL);
  };

  // Start the processing loop
  startProcessing();
};
