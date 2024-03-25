import { pino } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import generateRedactions from './utils';
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
        let timestamps = new Date();
        if (storage.getStore()) {
            traceId = storage.getStore()['correlation-id'];
        }

        this.logger[level]({
            traceId,
            timestamps,
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

        this.getRequestLog(req);
        this.getResponseLog(res);
    }

    private getRequestLog(req: Request): any {
        this.info('Request Payload:', {
            request: {
                method: req.method,
                url: req.originalUrl,
                query: req.query,
                body: req.body,
                headers: req.headers,
                ip: req.ip,
            },
        });
    };
    
    private getResponseLog(res: Response): any {
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
            } catch (error) {
                // logger.warn(null, 'Warning: Response body is string!');
            }
    
            res.setHeader('origin', 'restjs-req-res-logging-repo');
            const responseLog = {
                response: {
                    statusCode: res.statusCode,
                    body: body || {},
                    headers: res.getHeaders(),
                },
            };
    
            this.info('Response Payload:', responseLog);
            rawResponseEnd.apply(res, resArgs);
            return responseLog as unknown as Response;
        };
    
        return res;
    };

    get pinoLogger() {
        this.setup();
        return this.logger;
    }
}