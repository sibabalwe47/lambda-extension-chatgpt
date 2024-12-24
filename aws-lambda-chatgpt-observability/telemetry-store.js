import { logger } from "./helpers.js";
import * as datastore from "./data.js";

export const storeRequestId = (event) => {
  datastore.state.requestBacklogIds.push(event.requestId);
  storeInitialTelemetryRecord(event);
};

const storeInitialTelemetryRecord = (event) => {
  logger({
    message: `Create request record in the telemetry store for requestId - ${event.requestId}`,
    type: "INFO",
  });
  datastore.state.telemetryStore.push({
    requestId: event.requestId,
    data: {},
  });
};

export const storeTelemetryMetricsFromLambdaService = (metrics) => {
  datastore.state.sessionEventsQueue.push(...metrics);
};

export const updateRequestById = (requestId, start, metrics, logs) => {
  logger({
    message: `Updating telemetry data for request ID - ${requestId}`,
    type: "INFO",
  });

  const requestIdIndex = datastore.state.telemetryStore.findIndex(
    (item) => item.requestId === requestId
  );

  const record = datastore.state.telemetryStore.find(
    (item) => item.requestId === requestId
  );
  record.data = {
    start,
    metrics,
    logs,
  };

  datastore.state.telemetryStore[requestIdIndex] = record;
};

export const removeRequestById = (requestId) => {
  logger({
    message: `Removing record for request ID - ${requestId}`,
    type: "INFO",
  });
  const requestIdIndex = datastore.state.requestBacklogIds.indexOf(requestId);
  datastore.state.requestBacklogIds.splice(requestIdIndex, 1);
};
