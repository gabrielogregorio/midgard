import { CustomError } from '../error';
import { LogService } from '../services/log';
import { SchemaType } from '../types';
import { findRecursiveFiles } from './searchRecursiveFiles';
import { readConfigFile } from './readConfigFile';
import { readFile } from './readFile';
import { handlerCollectHttp } from '../handlers/handlerCollectHttp';
import { handlerMarkdown } from '../handlers/handlerMarkdown';
import { handlerSwagger } from '../handlers/handlerSwagger';
import { handlerComments } from '../handlers/handlerComments';
import { handlerOpenApi3 } from '../handlers/handlerOpenApi3';

type processHandlerType = {
  directory: string;
  bannedPaths: string[];
};

export const processHandler = (input: processHandlerType): SchemaType[] => {
  LogService.info(`docbytest started analysis with settings "${JSON.stringify(input)}"`);

  const config = readConfigFile(input.directory);

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

      const fullContext = `${config.context}.${config.name}`.split('.');
      const tags = [...fullContext, ...fileTags];

      pages = pages.concat(handlerComments(fileText, config, filePath, tags));
      pages = pages.concat(handlerSwagger(fileText, config, filePath, tags));
      pages = pages.concat(handlerOpenApi3(fileText, config, filePath, tags));
      pages = pages.concat(handlerCollectHttp(fileText, config, filePath, tags));
      pages = pages.concat(handlerMarkdown(fileText, config, filePath, tags));
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
