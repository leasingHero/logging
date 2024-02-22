import { Logger } from './logger';

interface LoggingConfig {
    withFilter(filters: string[]): void
    withFormatter(format: string): void
    withLevel(level: string): void
}


export class CreateLogging implements LoggingConfig {
    private logging: Logger;

    constructor() {
        this.logging = new Logger();
    }

    public withFilter(filters: string[]): void {
        this.logging.filter = filters;
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

}


