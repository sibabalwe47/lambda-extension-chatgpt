// Telemetry application state
export const state = {
  /* stores the lambda requests Ids coming Lambda service */
  requestBacklogIds: [],

  /* stores metrics data from lambda service throughout lambda function's lifecycle */
  sessionEventsQueue: [],

  /* stores processed telemetry data for each request */
  telemetryStore: [],
};
