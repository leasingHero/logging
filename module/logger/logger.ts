import { pino } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import generateRedactions from './utils';
import { httpMiddleware as middleware } from './middleware';
import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage();

interface ILogger {
    info(msg: string, data?: any): void;
    debug(msg: string, data?: any): void;
    trace(msg: string, data?: any): void;
    warn(msg: string, data?: any): void;
    error(msg: string, data?: any, error?: Error): void;
    fatal(msg: string, data?: any, error?: Error): void;
    httpMiddleware(req: Request, res: Response): void;
}

type LoggerLevel = 'info' | 'debug' | 'trace' | 'warn' | 'error' | 'fatal';
export class Logger implements ILogger {
    private logger!: pino.Logger;

    public redactions: string[] = [];
    public format = '';
    public level = 'info';

    constructor() {}

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

    private log(level: LoggerLevel, msg: string, data?: any, error?: Error) {
        let traceId: string;
        if (storage.getStore()) {
            traceId = storage.getStore()['correlation-id'];
        }

        this.logger[level]({
            traceId,
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

    public httpMiddleware(req: Request, res: Response): void {
        const uuid = uuidv4();

        storage.enterWith({
            'correlation-id': uuid,
        });

        middleware(req, res, this.logger, uuid);
    }

    get pinoLogger() {
        this.setup();
        return this.logger;
    }
}