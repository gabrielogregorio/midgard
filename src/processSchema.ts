import { processHandler } from './modules';
import { SchemaType } from './types';
import { readBaseConfigFile } from './modules/readBaseConfigFile';
import { LogService } from './services/log';
import { resetPublicFolder } from './utils/resetPublicFolder';

export const processSchema = (configFile: string) => {
  try {
    const config = readBaseConfigFile(configFile);

    resetPublicFolder();

    let fullSchema: SchemaType[] = [];
    config.projects.forEach((conf) => {
      fullSchema = fullSchema.concat(processHandler(conf));
    });

    return {
      schema: fullSchema,
      hierarchy: config.hierarchy
    };
  } catch (error) {
    if (error instanceof Error) {
      LogService.error(error);
    }

    LogService.error(error);
    return null;
  }
};
