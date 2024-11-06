import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { TOSS_PAYMENTS_ERROR } from '~/errors/toss-payments-error';

@Catch(AxiosError)
export class TossPaymentsConfirmFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp: string = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });

    const ex = handlingException(exception);

    let responseStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.response.status) {
      case 400:
        responseStatus = HttpStatus.BAD_REQUEST;
        break;
      case 401:
        responseStatus = HttpStatus.UNAUTHORIZED;
        break;
      case 403:
        responseStatus = HttpStatus.FORBIDDEN;
        break;
      case 404:
        responseStatus = HttpStatus.NOT_FOUND;
        break;
      default:
        responseStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(responseStatus).json({
      errorCode: ex.code,
      status: responseStatus,
      msg: ex.message,
      timestamp,
      path: request.url,
    });
  }
}

interface ExceptionStatus {
  code: string;
  message: string;
}

const handlingException = (err: AxiosError): ExceptionStatus => {
  const code = err.response.data['code'];

  if (!!code) {
    return Object.keys(TOSS_PAYMENTS_ERROR).includes(code)
      ? TOSS_PAYMENTS_ERROR[code]
      : {
          code: 'UNCATCHED',
          message: '알 수 없는 오류가 발생했어요.',
        };
  }

  return {
    code: 'UNCATCHED',
    message: '알 수 없는 오류가 발생했어요.',
  };
};
