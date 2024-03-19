"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitLogging = void 0;
const logger_1 = require("./logger");
const middleware_1 = require("./middleware");
const correlation_1 = require("./correlation");
const uuid_1 = require("uuid");
class InitLogging {
    constructor() {
        this.correlationIdLog = new correlation_1.CorrelationIdLog();
        this.logging = new logger_1.Logger(this.correlationIdLog);
    }
    withRedaction(redactions) {
        this.logging.redactions = redactions;
        return this;
    }
    withFormatter(format) {
        this.logging.format = format;
        return this;
    }
    withLevel(level) {
        this.logging.level = level;
        return this;
    }
    initialize() {
        this.logging.pinoLogger;
        return this.logging;
    }
    httpMiddleware(req, res, next) {
        this.correlationIdLog.set('correlation-id', (0, uuid_1.v4)());
        return (0, middleware_1.httpMiddleware)(req, res, next, this.logging);
    }
}
exports.InitLogging = InitLogging;
//# sourceMappingURL=setup.js.map