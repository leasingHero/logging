// Import logging initialization from logger setup
import { InitLogging } from '../module/logger/setup';

// Initialize and configure logging
const log = new InitLogging()
    // Redaction: Array of sensitive data such as passwords and tokens
    .withRedaction(['password', 'token'])
    // Formatter: Choose log format; 'pino-pretty' for a visually appealing log, default is JSON
    .withFormatter('pino-pretty')
    // Log level: Options include trace (10) and debug (20), info (30), warn (40), error (50), and fatal (60).
    // Default is info. Will not log messages with a lower level.
    .withLevel('info')
    .initialize();

// Sample data for logging
const data = {
    employees: [
        {
            name: 'messi',
            email: 'messi@moladin.com',
            password: 'realmadrid',
            token: 'secret',
        },
    ],
};

// Log messages at different levels
log.info('This is an informational message', data);
log.debug('This is a debugging message', data);
log.trace('This is a trace message', data);
log.warn('This is a warning message', data);
log.error('This is an error message', null, new Error('Something went wrong!'));
log.fatal('This is a fatal message', null, new Error('Panic!'));
