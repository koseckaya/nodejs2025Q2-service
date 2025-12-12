import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggingService } from './logger.service';
import { Observable, tap } from 'rxjs';
import { formatData } from 'src/shared/format-data';
import { sanitize } from 'src/shared/sanitaze';

@Injectable()
export class LoggingMiddleware implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const { method, url, query, body } = request;
    const { statusCode } = response;

    return next.handle().pipe(
      tap((data) => {
        this.logger.log(
          `[HttpInterceptor Request] ${formatData([
            { fieldName: 'url', fieldValue: url },
            { fieldName: 'method', fieldValue: method },
            { fieldName: 'body', fieldValue: sanitize(body) },
            { fieldName: 'query', fieldValue: query },
          ])}`,
        );
        this.logger.log(
          `[HttpInterceptor Response] ${formatData([
            { fieldName: 'statusCode', fieldValue: statusCode },
            { fieldName: 'data', fieldValue: sanitize(data) },
          ])}`,
        );
      }),
    );
  }
}
