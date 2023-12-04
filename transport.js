const { createTransport } = require("@sentry/core");
const { parseEnvelope } = require("@sentry/utils");
const { inspect } = require("util");

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// A transport that logs all envelopes to the console
exports.transport = () => {
  return createTransport(
    { recordDroppedEvent: () => {}, textEncoder },
    async (request) => {
      const env = parseEnvelope(request.body, textEncoder, textDecoder);
      console.log(inspect(env, false, null, true));
      return { statusCode: 200 };
    }
  );
};
