import { pino } from 'pino';
import { CorrelationIdLog } from './correlation';
interface ILogger {
    info(msg: string, data?: any): void;
    debug(msg: string, data?: any): void;
    trace(msg: string, data?: any): void;
    warn(msg: string, data?: any): void;
    error(msg: string, data?: any, error?: Error): void;
    fatal(msg: string, data?: any, error?: Error): void;
}
export declare class Logger implements ILogger {
    private correlationIdLog;
    private traceId;
    redactions: string[];
    format: string;
    level: string;
    private logger;
    constructor(correlationIdLog: CorrelationIdLog);
    private setup;
    setTraceId(traceId: string): void;
    private getTraceId;
    private log;
    info(msg: string, data?: any): void;
    debug(msg: string, data?: any): void;
    trace(msg: string, data?: any): void;
    warn(msg: string, data?: any): void;
    error(msg: string, data?: any, error?: Error): void;
    fatal(msg: string, data?: any, error?: Error): void;
    get pinoLogger(): pino.Logger<never>;
}
export {};
