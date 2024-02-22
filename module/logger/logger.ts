import {pino} from 'pino';

export class Logger {
    public filter: string[] = [];
    public format: string = '';
    public level: string = 'info';

    private logger: any;

    constructor() {
        this.logger = pino({
            level: this.level,
        });
    }

    // filter pino

    // format pino

    get pinoLogger() {
        return this.logger;
    }
}