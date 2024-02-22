import { Logger } from './logger';

interface LoggingConfig {
    withRedaction(redactions: string[]): void;
    withFormatter(format: string): void;
    withLevel(level: string): void;
    init(): Logger;
}

export class InitLogging implements LoggingConfig {
    private logging: Logger;

    constructor() {
        this.logging = new Logger();
    }

    public withRedaction(redactions: string[]): void {
        this.logging.redactions = redactions;
    }

    public withFormatter(format: string): void {
        this.logging.format = format;
    }

    public withLevel(level: string): void {
        this.logging.level = level;
    }

    public init(): Logger {
        this.logging.pinoLogger;
        return this.logging;
    }
}
