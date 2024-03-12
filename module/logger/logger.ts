import { pino } from 'pino';
import { v4 as uuidv4 } from 'uuid';

import generateRedactions from './utils';

interface ILogger {
    info(msg: string, data?: any): void;
    debug(msg: string, data?: any): void;
    trace(msg: string, data?: any): void;
    warn(msg: string, data?: any): void;
    error(msg: string, data?: any, error?: Error): void;
    fatal(msg: string, data?: any, error?: Error): void;
}

type LoggerLevel = 'info' | 'debug' | 'trace' | 'warn' | 'error' | 'fatal';
export class Logger implements ILogger {
    private logger!: pino.Logger;

    private traceId!: string;
    public redactions: string[] = [];
    public format = '';
    public level = 'info';

    private setup() {
        const config: pino.LoggerOptions = {
            level: this.level,
            timestamp: pino.stdTimeFunctions.isoTime,
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
                paths: generateRedactions(this.redactions),
                censor: '[*********]',
            };
        }

        this.logger = pino(config);
    }

    public setTraceId(traceId: string) {
        this.traceId = traceId;
    }

    private getTraceId() {
        return this.traceId || (this.traceId = uuidv4());
    }

    private log(level: LoggerLevel, msg: string, data?: any, error?: Error) {
        this.logger[level]({
            traceId: this.getTraceId(),
            msg,
            data,
            error: error
                ? { msg: error.message, stack: error.stack }
                : undefined,
        });
    }

    public info(msg: string, data?: any) {
        this.log('info', msg, data);
    }

    public debug(msg: string, data?: any) {
        this.log('debug', msg, data);
    }

    public trace(msg: string, data?: any) {
        this.log('trace', msg, data);
    }

    public warn(msg: string, data?: any) {
        this.log('warn', msg, data);
    }

    public error(msg: string, data?: any, error?: Error) {
        this.log('error', msg, data, error);
    }

    public fatal(msg: string, data?: any, error?: Error) {
        this.log('fatal', msg, data, error);
    }

    get pinoLogger() {
        this.setup();
        return this.logger;
    }
}
