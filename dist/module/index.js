"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./logger/setup");
const loggingConfig = new setup_1.InitLogging()
    .withRedaction(['password', 'token'])
    .withFormatter('pino-pretty')
    .withLevel('info');
const log = loggingConfig.initialize();
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
//# sourceMappingURL=index.js.map