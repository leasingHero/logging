import { InitLogging } from './logger/setup';

const loggingConfig = new InitLogging()
    .withRedaction(['password', 'token'])
    .withFormatter('pino-pretty')
    .withLevel('info');

const log = loggingConfig.initialize();

// const data = {
//     employees: [
//         {
//             name: 'messi',
//             email: 'messi@moladin.com',
//             password: 'realmadrid',
//             token: 'secret',
//         },
//     ],
// };

// log.info('This is an informational message', data);
// log.debug('This is a debugging message', data);
// log.trace('This is a trace message', data);
// log.warn('This is a warning message', data);
// log.error('This is an error message', null, new Error('Something went wrong!'));
// log.fatal('This is a fatal message', null, new Error('Panic!'));


const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/tes/:id', (req, res, next) => {
    log.info('log info pertama 1');
    loggingConfig.httpMiddleware(req, res, next);
    log.info('log info kedua 2');
    res.send({
        message: 'Hello World!'
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
