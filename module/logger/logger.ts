import { pino } from 'pino';
import generateRedactions from './utils';

interface ILogger {
    info(traceId: string, msg: string, data?: any): void;
    debug(traceId: string, msg: string, data?: any): void;
    trace(traceId: string, msg: string, data?: any): void;
    warn(traceId: string, msg: string, data?: any): void;
    error(traceId: string, msg: string, data?: any, error?: Error): void;
    fatal(traceId: string, msg: string, data?: any, error?: Error): void;
}

interface LoggerConfig {
    level: string;
    timestamp: () => string;
    formatters: {
        level: (label: string) => { level: string };
    };
    transport?: {
        target: string;
    };
    redact?: {
        paths: string[];
        censor: string;
    };
}

export class Logger implements ILogger {
    public redactions: string[] = [];
    public format: string = '';
    public level: string = 'info';

    private logger: pino.Logger;

    private setup() {
        const config: LoggerConfig = {
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
                censor: '[*********]'
            };
        }

        this.logger = pino(config);
    }

    public info(traceId: string, msg: string, data?: any) {
        this.logger.info({ traceId, msg, data });
    }

    public debug(traceId: string, msg: string, data?: any) {
        this.logger.debug({ traceId, msg, data });
    }

    public trace(traceId: string, msg: string, data?: any) {
        this.logger.trace({ traceId, msg, data });
    }

    public warn(traceId: string, msg: string, data?: any) {
        this.logger.warn({ traceId, msg, data });
    }

    public error(traceId: string, msg: string, data?: any, error?: Error) {
        this.logger.error({
            traceId,
            msg,
            data,
            error: error
                ? {
                      msg: error.message,
                      stack: error.stack,
                  }
                : undefined,
        });
    }

    public fatal(traceId: string, msg: string, data?: any, error?: Error) {
        this.logger.fatal({
            traceId,
            msg,
            data,
            error: error
                ? {
                      msg: error.message,
                      stack: error.stack,
                  }
                : undefined,
        });
    }

    get pinoLogger() {
        this.setup();
        return this.logger;
    }
}
