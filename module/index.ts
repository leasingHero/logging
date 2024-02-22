import {CreateLogging} from './logger/setup';

const logging = new CreateLogging();
logging.withFilter(['info', 'error']);
logging.withFormatter('json');
logging.withLevel('error');

const debug = logging.run(); // masuk sini [ 'info', 'error' ] json error

debug.info('this is info');