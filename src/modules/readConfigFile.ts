import path from 'path';
import { readFile } from './readFile';

export type configFile = {
  context: string;
  name: string;
};

import { ZodError, z } from 'zod';
import { LogService } from '../services/log';
import { CustomError } from '../error';

const User = z.object({
  context: z.string(),
  name: z.string()
});

export const readConfigFile = (folderPath: string): configFile => {
  const configFilePath = path.resolve(folderPath, 'docbytest.config.json');

  LogService.info(`searching for configuration file in "${configFilePath}"`);

  let configFile = '';
  try {
    configFile = readFile(configFilePath);
  } catch (error: unknown) {
    throw new CustomError(`unknow error on read "${configFilePath}"`, error);
  }

  try {
    const config = User.parse(JSON.parse(configFile));

    const response = {
      name: config.name,
      context: config.context
    };

    if (response.name.includes('.')) {
      throw new Error(
        `name of the project is an identifier, and cannot contain DOTS (.), the name used in the project "${configFilePath}" violates this rule "${response.name}". REMOVE DOTS (.)`
      );
    }

    LogService.info(`settings successfully obtained "${JSON.stringify(response)}"`);

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CustomError(`Error validating configuration file schema in "${configFilePath}", errors ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
};
