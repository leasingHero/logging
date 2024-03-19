import { Logger } from './logger';


interface LoggingConfig {
    withRedaction(redactions: string[]): LoggingConfig;
    withFormatter(format: string): LoggingConfig;
    withLevel(level: string): LoggingConfig;
    initialize(): Logger;
}

export class InitLogging implements LoggingConfig {
    private logging: Logger;

    constructor() {
        this.logging = new Logger();
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
}
