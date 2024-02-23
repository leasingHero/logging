import { InitLogging } from './logger/setup';

const log = new InitLogging()
    .withRedaction(['password', 'token'])
    .withFormatter('pino-pretty')
    .withLevel('info')
    .initialize();

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

log.info('This is an informational message', data);
log.debug('This is a debugging message', data);
log.trace('This is a trace message', data);
log.warn('This is a warning message', data);
log.error('This is an error message', null, new Error('Something went wrong!'));
log.fatal('This is a fatal message', null, new Error('Panic!'));
