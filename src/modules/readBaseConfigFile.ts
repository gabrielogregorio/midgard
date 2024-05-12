import { readFile } from './readFile';
import { ZodError, z } from 'zod';
import { LogService } from '../services/log';
import { CustomError } from '../error';

type scrappersType = {
  bannedPaths: string[];
  filterFile: string;
  directory: string;
  muteLogsListOfAnalyzedFiles: boolean;
};

type hierarchyType = {
  tags: string[];
  title: string;
};

type configBase = {
  scrappers: scrappersType[];
  hierarchy: hierarchyType[];
};

const scrappersSchema = z.object({
  bannedPaths: z.array(z.string()),
  filterFile: z.string(),
  directory: z.string(),
  muteLogsListOfAnalyzedFiles: z.boolean()
});

const hierarchySchema = z.object({
  tags: z.array(z.string()),
  title: z.string()
});

const ConfigSchema = z.object({
  scrappers: z.array(scrappersSchema),
  hierarchy: z.array(hierarchySchema)
});

export const readBaseConfigFile = (configFilePath: string): configBase => {
  LogService.info(`searching for configuration file in "${configFilePath}"`);

  let configFile = '';
  try {
    configFile = readFile(configFilePath);
  } catch (error: unknown) {
    throw new CustomError(`unknow error on read "${configFilePath}"`, error);
  }

  try {
    return ConfigSchema.parse(JSON.parse(configFile));
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CustomError(`Error validating configuration file schema in "${configFilePath}", errors ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
};
