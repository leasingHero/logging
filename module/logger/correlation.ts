import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CorrelationIdLog {
    private readonly contextMap: Map<string, any> = new Map();

    async set<T>(key: string, value: T): Promise<void> {
        this.contextMap.set(key, value);
    }

    async get<T>(key: string): Promise<T | undefined> {
        return this.contextMap.get(key) as T;
    }
}
