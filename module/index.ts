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

log.info('3548292a-ec74-4464-b46c-211f881068b9', 'this is info', sampleData)
log.debug('3548292a-ec74-4464-b46c-211f881068b9', 'this is debug', sampleData)
log.trace('3548292a-ec74-4464-b46c-211f881068b9', 'this is trace', sampleData)
log.warn('3548292a-ec74-4464-b46c-211f881068b9', 'this is warn', sampleData)
log.error('3548292a-ec74-4464-b46c-211f881068b9', 'this is error', null, new Error('something went wrong!'))
log.fatal('3548292a-ec74-4464-b46c-211f881068b9', 'this is fatal', null, new Error('panic!'))