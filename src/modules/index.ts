import { CustomError } from '../error';
import { LogService } from '../services/log';
import { SchemaType } from '../types';
import { findRecursiveFiles } from './searchRecursiveFiles';
import { readFile } from './readFile';
import { handlerCollectHttp } from '../handlers/handlerCollectHttp';
import { handlerMarkdown } from '../handlers/handlerMarkdown';
import { handlerSwagger } from '../handlers/handlerSwagger';
import { handlerComments } from '../handlers/handlerComments';
import { handlerOpenApi3 } from '../handlers/handlerOpenApi3';
import { processHandlerType } from './types';

export const processHandler = (input: processHandlerType): SchemaType[] => {
  LogService.info(`docbytest started analysis with settings "${JSON.stringify(input)}"`);

  LogService.info(`Searching for documentation files in "${input.directory}"`);
  const files = findRecursiveFiles(input);

  LogService.info(`Searching documentation files finished`);

  LogService.info(`starting data extraction from files`);

  let pages: SchemaType[] = [];

  files.files.forEach((filePath) => {
    try {
      const fileText = readFile(filePath).toString();
      const fileTags = [
        ...new Set(
          filePath
            .replaceAll('.', ' ')
            .replaceAll('/', ' ')
            .split(' ')
            .filter((part) => part.trim())
        )
      ];

      const tags = [...input.tags, ...fileTags];

      pages = pages.concat(handlerComments(fileText, input, filePath, tags));
      pages = pages.concat(handlerSwagger(fileText, input, filePath, tags));
      pages = pages.concat(handlerOpenApi3(fileText, input, filePath, tags));
      pages = pages.concat(handlerCollectHttp(fileText, input, filePath, tags));
      pages = pages.concat(handlerMarkdown(fileText, input, filePath, tags));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new CustomError(`Error reading filePath "${filePath}", error "${error}", stack=${error?.stack}`);
      }

      throw new CustomError(`Error reading filePath "${filePath}", error "${error}"`);
    }
  });

  if (pages.length) {
    LogService.info(`Data extraction completed with ${pages.length} items`);
  } else {
    LogService.warning(`Data extraction completed with ${pages.length} items`);
  }

  return pages;
};
