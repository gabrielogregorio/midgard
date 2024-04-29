import { CustomError } from '../error';
import { LogService } from '../services/log';
import { SchemaType, PageType } from '../types';
import { Main } from './main';
import { findRecursiveFiles } from './searchRecursiveFiles';
import { readConfigFile } from './readConfigFile';
import { readFile } from './readFile';

export type inputSchemasType = {
  fullcontext: string;
  base: SchemaType;
};

type inputType = {
  directory: string;
  bannedPaths: RegExp[];
  filterFile?: RegExp;
  muteLogsListOfAnalyzedFiles: boolean;
};

export const index = (input: inputType): inputSchemasType => {
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

  let pages: PageType[] = [];

  files.files.forEach((file) => {
    try {
      const content = readFile(file);

      const local = Main.process(content, { file });

      if (local.length) {
        pages = [...pages, ...local];
      }
    } catch (error: unknown) {
      throw new CustomError(`Error reading file "${file}", error "${error}"`);
    }
  });

  if (pages.length) {
    LogService.info(`Data extraction completed with ${pages.length} items`);
  } else {
    LogService.warning(`Data extraction completed with ${pages.length} items`);
  }

  return {
    fullcontext: config.context + '.' + config.name,
    base: {
      name: config.name,
      children: [
        {
          title: 'doc endpoints',
          page: pages
        }
      ]
    }
  };
};
