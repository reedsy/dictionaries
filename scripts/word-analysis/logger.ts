import {LoggerFactory} from '@reedsy/reedsy-logger-js';

const loggerFactory = new LoggerFactory({
  consoleEnabled: true,
  environment: process.env.NODE_ENV,
  logLevel: 'INFO',
});

export const logger = loggerFactory.create('DictionaryWordQueueAnalysis');
