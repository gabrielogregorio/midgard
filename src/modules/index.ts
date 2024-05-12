import { CustomError } from '../error';
import { LogService } from '../services/log';
import { SchemaType } from '../types';
import { findRecursiveFiles } from './searchRecursiveFiles';
import { readConfigFile } from './readConfigFile';
import { readFile } from './readFile';
import { processComments } from './processComments';
import { processMarkdown } from './processMarkdown';
import { processSwagger } from './processSwagger';

type inputType = {
  directory: string;
  bannedPaths: string[];
  filterFile?: string;
  muteLogsListOfAnalyzedFiles: boolean;
};

export const index = (input: inputType): SchemaType[] => {
  LogService.info('docbytest started analysis');
  LogService.info(`running with the following settings "${JSON.stringify(input)}"`);

  let config = readConfigFile(input.directory);

  LogService.info(`Searching for documentation files in "${input.directory}"`);
  const files = findRecursiveFiles(input);
  if (!input.muteLogsListOfAnalyzedFiles) {
    LogService.info(`files found ${files.files.map((item) => `\n  - ${item}`)}`);
    LogService.warning(`files ignored by the filter ${files.ignoredFiles.map((item) => `\n  - ${item}`)}`);
    LogService.warning(`excluded paths ${files.ignoredFiles.map((item) => `\n  - ${item}`)}`);
  }
  LogService.info(`Searching documentation files finished`);

  LogService.info(`starting data extraction from files`);

  let pages: SchemaType[] = [];

  files.files.forEach((file) => {
    try {
      const content = readFile(file);
      pages = pages.concat(processComments(content, config, file));

      const processSwaggerResult = processSwagger(content, config, file);
      pages = pages.concat(processSwaggerResult);

      if (file.endsWith('.md') || file.endsWith('.MD')) {
        pages = pages.concat(processMarkdown(content, config, file));
      }
    } catch (error: unknown) {
      throw new CustomError(`Error reading file "${file}", error "${error}"`);
    }
  });
  const fullcontext = (config.context + '.' + config.name).split('.');

  pages = pages.map((page) => {
    return {
      ...page,
      tags: [...fullcontext, ...(page.tags || [])]
    };
  });

  if (pages.length) {
    LogService.info(`Data extraction completed with ${pages.length} items`);
  } else {
    LogService.warning(`Data extraction completed with ${pages.length} items`);
  }

  return pages;
};
