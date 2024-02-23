import {CreateLogging} from './logger/setup';

const logging = new CreateLogging();
logging.withFilter(null);
logging.withFormatter('');
logging.withLevel('info');

const debug = logging.run(); // masuk sini [ 'info', 'error' ] json error

debug.info({
    msg: {
        "test": "test"
    },
    request: {
        hello: 'world'
    }
});
debug.debug('this is info');
debug.fatal('this is info');
debug.trace('this is info');
debug.warn('this is info');
debug.error('this is info');

// 1. filter message PIC + abstraksi @yusuf
// 2. middleware PIC @Kevin
// f


const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/tes/:id', (req, res, next) => {
    logging.httpMiddleware(req, res, next);
    res.send({
        message: 'Hello World!'
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});