import { Logger } from './logger';
import { httpMiddleware as middleware } from './middleware';
import { Request, Response, NextFunction } from 'express';

interface LoggingConfig {
    withFilter(filterFunc: (log: any) => boolean): void
    withFormatter(format: string): void
    withLevel(level: string): void
    httpMiddleware(req: Request, res: Response, next: NextFunction): void
}


export class CreateLogging implements LoggingConfig {
    private logging: Logger;

    constructor() {
        this.logging = new Logger();
    }

    public withFilter(filterFunc: (log: any) => boolean): void {
        this.logging.filter = filterFunc;
    }

    public withFormatter(format: string): void {
        this.logging.format = format;
    }

    public withLevel(level: string): void {
        this.logging.level = level;
    }

    public run() {
        return this.logging.pinoLogger;
    }

    public httpMiddleware(req: Request, res: Response, next: NextFunction): void {
        return middleware(req, res, next, this.logging.pinoLogger);
    }

}


