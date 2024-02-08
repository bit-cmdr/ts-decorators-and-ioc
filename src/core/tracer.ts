/* eslint-disable @typescript-eslint/ban-types */
import pkg from 'dd-trace';

const { tracer } = pkg;

tracer.init({
  plugins: false,
  logInjection: true,
}); // initialized in a different file to avoid hoisting.

tracer.use('express', {
  enabled: true,
});

tracer.use('graphql', {
  enabled: true,
  signature: true,
  source: true,
});

tracer.use('aws-sdk', {
  enabled: true,
  sqs: true,
  dynamodb: true,
  eventbridge: true,
  lambda: true,
});

export default tracer;
