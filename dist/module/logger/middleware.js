"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMiddleware = void 0;
const getRequestLog = (req) => {
    return {
        request: {
            method: req.method,
            url: req.originalUrl,
            query: req.query,
            body: req.body,
            headers: req.headers,
            ip: req.ip,
        },
    };
};
const getResponseLog = (res, logger) => {
    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunkBuffers = [];
    res.write = (...chunks) => {
        const resArgs = [];
        for (let i = 0; i < chunks.length; i++) {
            resArgs[i] = chunks[i];
            if (!resArgs[i]) {
                res.once('drain', res.write);
                --i;
            }
        }
        if (resArgs[0]) {
            chunkBuffers.push(Buffer.from(resArgs[0]));
        }
        return rawResponse.apply(res, resArgs);
    };
    res.end = (...chunk) => {
        const resArgs = [];
        for (let i = 0; i < chunk.length; i++) {
            resArgs[i] = chunk[i];
        }
        if (resArgs[0]) {
            chunkBuffers.push(Buffer.from(resArgs[0]));
        }
        let body = Buffer.concat(chunkBuffers).toString('utf8');
        try {
            body = JSON?.parse(body);
        }
        catch (error) {
            logger.warn(null, 'Warning: Response body is string!');
        }
        res.setHeader('origin', 'restjs-req-res-logging-repo');
        const responseLog = {
            response: {
                statusCode: res.statusCode,
                body: body || {},
                headers: res.getHeaders(),
            },
        };
        logger.info(responseLog);
        rawResponseEnd.apply(res, resArgs);
        return responseLog;
    };
    return res;
};
function httpMiddleware(req, res, next, logger) {
    logger.info(getRequestLog(req));
    getResponseLog(res, logger);
    next();
}
exports.httpMiddleware = httpMiddleware;
//# sourceMappingURL=middleware.js.map