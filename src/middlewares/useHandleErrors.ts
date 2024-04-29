import { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { LogService } from '../services/log';
import { CustomError } from '../error';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const useHandleErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    LogService.error(error.message, error.error);
    res.status(500).json({ message: 'Internal Error' });
    return;
  }

  if (error instanceof Error) {
    console.error(`Error ${error.name} ${error.message} ${JSON.stringify(error?.stack)}`);
    res.status(500).json({ message: 'Internal Error' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Internal Error' });
};
