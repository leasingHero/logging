import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CorrelationIdLog {
    private readonly contextMap: Map<string, any> = new Map();

    set<T>(key: string, value: T): void {
        this.contextMap.set(key, value);
    }

    get<T>(key: string): T | undefined {
        return this.contextMap.get(key) as T;
    }
}