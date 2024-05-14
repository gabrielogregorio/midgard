import express from 'express';
import fs from 'fs';
import path from 'path';
import { useCors } from './middlewares/useCors';
import { useHandleErrors } from './middlewares/useHandleErrors';
import { processHandler } from './modules';
import { SchemaType } from './types';
import { readBaseConfigFile } from './modules/readBaseConfigFile';
import { hierarchyType } from './modules/types';
import { LogService } from './services/log';
import { statusCode } from './utils/statusCode';

require('dotenv').config();

const app = express();
app.disable('x-powered-by');
app.use(express.static('public'));
app.use(useCors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const deleteFile = (folder: string) => {
  if (!fs.existsSync(folder)) {
    return;
  }

  fs.readdirSync(folder).forEach((file) => {
    const currentPath = path.join(folder, file);

    if (fs.lstatSync(currentPath).isDirectory()) {
      deleteFile(currentPath);
      return;
    }

    fs.unlinkSync(currentPath);
  });
};

const createFile = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

let lastSchema: { schema: SchemaType[]; hierarchy: hierarchyType[] } = { schema: [], hierarchy: [] };
const status = {
  generateSchema: false,
  error: false
};

const TIME_TO_REFRESH_DOCS_IN_MS = 300;
setInterval(() => {
  try {
    if (status.generateSchema) {
      return;
    }

    const config = readBaseConfigFile('../config.json');
    const publicFolder = './public';
    deleteFile(publicFolder);
    createFile(publicFolder);

    let fullSchema: SchemaType[] = [];
    config.scrappers.forEach((conf) => {
      fullSchema = fullSchema.concat(processHandler(conf));
    });

    lastSchema = {
      schema: fullSchema,
      hierarchy: config.hierarchy
    };

    status.generateSchema = true;
  } catch (error) {
    if (error instanceof Error) {
      LogService.error(error);
      return;
    }

    LogService.error(error);
  }
}, TIME_TO_REFRESH_DOCS_IN_MS);

app.get('/', (_req, res) => res.sendStatus(statusCode.SUCCESS));

app.get('/schema', (_req, res) => res.json(lastSchema));

app.get('/status', (_req, res) => res.json(status));

app.use(useHandleErrors);

app.listen(process.env.PORT);
