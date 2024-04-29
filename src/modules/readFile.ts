import fs from 'fs';
import { CustomError } from '../error';

export const readFile = (file: string) => {
  try {
    return fs.readFileSync(file, 'utf-8').toString();
  } catch (error: unknown) {
    throw new CustomError(`Error on read file ${file}, error ${error}`);
  }
};
