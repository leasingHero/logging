import { Request, Response, NextFunction } from 'express';
export declare function httpMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
    logger: any,
): void;
