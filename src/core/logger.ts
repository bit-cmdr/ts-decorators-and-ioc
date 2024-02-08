import { LogEntry, Logger } from '@sibipro/pit-logger';
import { formats } from 'dd-trace/ext/index.js';
import tracer from './tracer.js';

const injectTrace = (entry: LogEntry) => {
  const span = tracer.scope().active();
  if (span) {
    tracer.inject(span.context(), formats.LOG, entry);
  }
};

const logger = new Logger(injectTrace);
export default logger;
