"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const pino_1 = require("pino");
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
class Logger {
    constructor(correlationIdLog) {
        this.correlationIdLog = correlationIdLog;
        this.redactions = [];
        this.format = '';
        this.level = 'info';
    }
    setup() {
        const config = {
            level: this.level,
            timestamp: pino_1.pino.stdTimeFunctions.isoTime,
            formatters: {
                level: (label) => ({ level: label.toUpperCase() }),
            },
        };
        if (this.format) {
            config.transport = {
                target: this.format,
            };
        }
        if (this.redactions.length > 0) {
            config.redact = {
                paths: (0, utils_1.default)(this.redactions),
                censor: '[*********]',
            };
        }
        this.logger = (0, pino_1.pino)(config);
    }
    setTraceId(traceId) {
        this.traceId = traceId;
    }
    getTraceId() {
        return this.traceId || (this.traceId = (0, uuid_1.v4)());
    }
    log(level, msg, data, error) {
        this.logger[level]({
            traceId: this.getTraceId(),
            correlationId: this.correlationIdLog.get('correlation-id'),
            msg,
            data,
            error: error
                ? { msg: error.message, stack: error.stack }
                : undefined,
        });
    }
    info(msg, data) {
        this.log('info', msg, data);
    }
    debug(msg, data) {
        this.log('debug', msg, data);
    }
    trace(msg, data) {
        this.log('trace', msg, data);
    }
    warn(msg, data) {
        this.log('warn', msg, data);
    }
    error(msg, data, error) {
        this.log('error', msg, data, error);
    }
    fatal(msg, data, error) {
        this.log('fatal', msg, data, error);
    }
    get pinoLogger() {
        this.setup();
        return this.logger;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map