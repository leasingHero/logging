import { Logger } from './logger';
import { Request, Response, NextFunction } from 'express';
interface LoggingConfig {
    withRedaction(redactions: string[]): LoggingConfig;
    withFormatter(format: string): LoggingConfig;
    withLevel(level: string): LoggingConfig;
    initialize(): Logger;
    httpMiddleware(req: Request, res: Response, next: NextFunction): void;
}
export declare class InitLogging implements LoggingConfig {
    private logging;
    private correlationIdLog;
    constructor();
    withRedaction(redactions: string[]): LoggingConfig;
    withFormatter(format: string): LoggingConfig;
    withLevel(level: string): LoggingConfig;
    initialize(): Logger;
    httpMiddleware(req: Request, res: Response, next: NextFunction): void;
}
export {};
