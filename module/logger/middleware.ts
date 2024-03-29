import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from './logger';


interface IMiddleware {
    httpMiddleware(req: Request, res: Response, logger: any): void
}

export class Middleware implements IMiddleware {
    public logger: Logger;
    public httpMiddleware(req: Request, res: Response):void {
        const uuid = uuidv4();
        this.logger.setTraceId(uuid);
        this.logger.info('Request Payload:', this.getRequestLog(req));
        this.getResponseLog(res, this.logger);
    }

    get pinoLoggerMiddleware() {
        return this;
    }

    private getRequestLog = (req: Request) => {
        return {
            request: {
                method: req.method,
                url: req.originalUrl,
                query: req.query,
                body: req.body,
                headers: req.headers,
                ip: req.ip,
            },
        };
    };
    
    private getResponseLog = (res: Response, logger: Logger) => {
        const rawResponse = res.write;
        const rawResponseEnd = res.end;
        const chunkBuffers = [];
    
        res.write = (...chunks) => {
            const resArgs = [];
            for (let i = 0; i < chunks.length; i++) {
                resArgs[i] = chunks[i];
                if (!resArgs[i]) {
                    res.once('drain', res.write);
                    --i;
                }
            }
    
            if (resArgs[0]) {
                chunkBuffers.push(Buffer.from(resArgs[0]));
            }
    
            return rawResponse.apply(res, resArgs);
        };
    
        res.end = (...chunk) => {
            const resArgs = [];
            for (let i = 0; i < chunk.length; i++) {
                resArgs[i] = chunk[i];
            }
    
            if (resArgs[0]) {
                chunkBuffers.push(Buffer.from(resArgs[0]));
            }
    
            let body = Buffer.concat(chunkBuffers).toString('utf8');
    
            try {
                body = JSON?.parse(body);
            } catch (error) {
                // logger.warn(null, 'Warning: Response body is string!');
            }
    
            // Set custom header for response
            res.setHeader('origin', 'restjs-req-res-logging-repo');
            const responseLog = {
                response: {
                    statusCode: res.statusCode,
                    body: body || {},
                    headers: res.getHeaders(),
                },
            };
    
            logger.info('Response Payload:', responseLog);
            // res.end() is satisfied after passing in restArgs as params
            // Doing so creates 'end' event to indicate that the entire body has been received.
            // Otherwise, the stream will continue forever (ref: https://nodejs.org/api/stream.html#event-end_1)
            rawResponseEnd.apply(res, resArgs);
            return responseLog as unknown as Response;
        };
    
        return res;
    };
    
}
