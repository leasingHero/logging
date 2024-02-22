import {pino} from 'pino';

export class Logger {
    public filter: (log: any) => boolean;
    public format: string = '';
    public level: string = 'info';

    private logger: any;

    private setup() {
        let config: any = {
            level: this.level,
        }

        if (this.format) {
            config.transport = {
                target: this.format,
            }
        }

        this.logger = pino(config);
    }

    // filter pino

    // format pino

    get pinoLogger() {
        this.setup();
        return this.logger;
    }
}