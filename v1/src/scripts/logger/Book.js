import { createLogger, format as _format, transports as _transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: _format.json(),
  defaultMeta: { service: 'book-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new _transports.File({ filename: 'v1/src/logs/books/error.log', level: 'error' }),
    new _transports.File({ filename: 'v1/src/logs/books/info.log', level: 'info' }),
    new _transports.File({ filename: 'v1/src/logs/books/combined.log' }),
  ], 
});



export default logger;