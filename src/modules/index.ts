import { CustomError } from '../error';
import { LogService } from '../services/log';
import { SchemaType } from '../types';
import { findRecursiveFiles } from './searchRecursiveFiles';
import { readConfigFile } from './readConfigFile';
import { readFile } from './readFile';
import { processComments } from './processComments';
import { processMarkdown } from './processMarkdown';
import { processSwagger } from './processSwagger';

type processHandlerType = {
  directory: string;
  bannedPaths: string[];
  filterFile?: string;
  muteLogsListOfAnalyzedFiles: boolean;
};

export const processHandler = (input: processHandlerType): SchemaType[] => {
  LogService.info('docbytest started analysis');
  LogService.info(`running with the following settings "${JSON.stringify(input)}"`);

  const config = readConfigFile(input.directory);

  LogService.info(`Searching for documentation files in "${input.directory}"`);
  const files = findRecursiveFiles(input);
  if (!input.muteLogsListOfAnalyzedFiles) {
    const filesFound = files.files.map((file) => `\n  - ${file}`);
    const filesIgnored = files.ignoredFiles.map((item) => `\n  - ${item}`);

    LogService.info(`files found ${filesFound}`);
    LogService.warning(`files ignored by the filter ${filesIgnored}`);
    LogService.warning(`excluded paths ${filesIgnored}`);
  }
  LogService.info(`Searching documentation files finished`);

  LogService.info(`starting data extraction from files`);

  let pages: SchemaType[] = [];

  files.files.forEach((file) => {
    try {
      const content = readFile(file);
      pages = pages.concat(processComments(content.toString(), config, file));

      const processSwaggerResult = processSwagger(content.toString(), config, file);
      pages = pages.concat(processSwaggerResult);

      if (file.endsWith('.md') || file.endsWith('.MD')) {
        const result = processMarkdown(content.toString(), config, file);
        pages = pages.concat(result);
      }
    } catch (error: unknown) {
      throw new CustomError(`Error reading file "${file}", error "${error}"`);
    }
  });
  const fullContext = `${config.context}.${config.name}`.split('.');

  pages = pages.map((page) => ({
    ...page,
    tags: [...fullContext, ...(page.tags || [])]
  }));

  if (pages.length) {
    LogService.info(`Data extraction completed with ${pages.length} items`);
  } else {
    LogService.warning(`Data extraction completed with ${pages.length} items`);
  }

  return pages;
};
