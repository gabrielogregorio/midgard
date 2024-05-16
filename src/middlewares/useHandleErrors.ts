import { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { LogService } from '../services/log';
import { CustomError } from '../error';
import { statusCode } from '../utils/statusCode';

const errorMessage = 'Internal Error';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const useHandleErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    LogService.error(error.message, error.error);
    res.status(statusCode.INTERNAL_ERROR).json({ message: errorMessage });
    return;
  }

  if (error instanceof Error) {
    LogService.error(`Error ${error.name} ${error.message} ${JSON.stringify(error?.stack)}`);
    res.status(statusCode.INTERNAL_ERROR).json({ message: errorMessage });
    return;
  }

  LogService.error(error);
  res.status(statusCode.INTERNAL_ERROR).json({ message: errorMessage });
};
