import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

// Turn raw Postgres constraint errors into clean 4xx responses (Safeer Part 2.8).
@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError & { code?: string }, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const map: Record<string, { status: number; message: string }> = {
      '23505': { status: HttpStatus.CONFLICT, message: 'A record with these values already exists.' },
      '23503': { status: HttpStatus.BAD_REQUEST, message: 'Related record not found or still in use.' },
      '23502': { status: HttpStatus.BAD_REQUEST, message: 'A required field is missing.' },
    };
    const handled = exception.code ? map[exception.code] : undefined;
    const status = handled?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: handled?.message ?? 'Database error.',
    });
  }
}
