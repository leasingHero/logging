import { Logger } from './logger';
import { httpMiddleware as middleware } from './middleware';
import { Request, Response, NextFunction } from 'express';
import { CorrelationIdLog } from './correlation';
import { v4 as uuidv4 } from 'uuid';

interface LoggingConfig {
    withRedaction(redactions: string[]): LoggingConfig;
    withFormatter(format: string): LoggingConfig;
    withLevel(level: string): LoggingConfig;
    initialize(): Logger;
    httpMiddleware(req: Request, res: Response, next: NextFunction): void;
}

export class InitLogging implements LoggingConfig {
    private logging: Logger;
    private correlationIdLog: CorrelationIdLog;

    constructor() {
        this.correlationIdLog = new CorrelationIdLog();
        this.logging = new Logger(this.correlationIdLog);
    }

    public withRedaction(redactions: string[]): LoggingConfig {
        this.logging.redactions = redactions;
        return this;
    }

    public withFormatter(format: string): LoggingConfig {
        this.logging.format = format;
        return this;
    }

    public withLevel(level: string): LoggingConfig {
        this.logging.level = level;
        return this;
    }

    public initialize(): Logger {
        this.logging.pinoLogger;
        return this.logging;
    }

    public httpMiddleware(req: Request, res: Response, next: NextFunction): void {
        this.correlationIdLog.set('correlation-id', uuidv4());
        return middleware(req, res, next, this.logging.pinoLogger);
    }
}
