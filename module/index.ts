import {InitLogging} from './logger/setup';

// configure
const logging = new InitLogging()
logging.withRedaction(['password', 'token']);
logging.withFormatter('');
logging.withLevel('info');

// init
const log = logging.init();

const sampleData = {
    employees: [{
            name: 'messi',
            email: 'messi@moladin.com',
            password: 'rahasia',
            token: 'secret'
        },
        {
            name: 'ronaldo',
            email: 'ronaldo@moladin.com',
            password: 'rahasia',
            token: 'secret'
        }
    ] 
}

log.info('this is info', sampleData)
log.debug('this is debug', sampleData)
log.trace('this is trace', sampleData)
log.warn('this is warn', sampleData)
log.error('this is error', null, new Error('something went wrong!'))
log.fatal('this is fatal', null, new Error('panic!'))
