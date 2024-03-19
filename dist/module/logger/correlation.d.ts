export declare class CorrelationIdLog {
    private readonly contextMap;
    set<T>(key: string, value: T): void;
    get<T>(key: string): T | undefined;
}
