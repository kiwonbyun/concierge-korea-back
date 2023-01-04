import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: any, res: any, next: () => void) {
    const logFunction = () => {
      this.logger.log(
        `[${req.ip}] 가 [${req.originalUrl}] 로 [${req.method}] 요청! 결과는 [${res.statusCode}]`,
      );
    };

    res.on('finish', logFunction);
    next();
  }
}
