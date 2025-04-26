import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Если это ошибка BadRequest и есть ValidationError
    if (
      exception instanceof BadRequestException &&
      exceptionResponse.message &&
      Array.isArray(exceptionResponse.message)
    ) {
      // Формирование ошибок в нужном формате
      const errors = exceptionResponse.message.map((error: string) => {
        // Извлечение имени поля из сообщения об ошибке
        const fieldMatch = error.match(/^([a-zA-Z]+) /);
        const field = fieldMatch ? fieldMatch[1] : 'unknown';
        
        return {
          message: error,
          field: field
        };
      });

      return response.status(status).json({
        errorsMessages: errors
      });
    }
    
    // Если это уже сформированная ошибка с полем errorsMessages
    if (exceptionResponse.errorsMessages) {
      return response.status(status).json(exceptionResponse);
    }

    // Для других типов ошибок
    return response.status(status).json({
      statusCode: status,
      message: exceptionResponse.message || 'Internal server error',
    });
  }
}
