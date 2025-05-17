import { AxiosError } from 'axios';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(AxiosError)
export class AxiosToHttpFilter implements ExceptionFilter {
  catch(error: AxiosError, host: ArgumentsHost) {
    const resp = host.switchToHttp().getResponse();
    const { status = HttpStatus.BAD_GATEWAY, data } = error.response ?? {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    resp
      .status(status)
      .json(
        typeof data === 'object' ? data : { message: data ?? 'Upstream error' },
      );
  }
}
