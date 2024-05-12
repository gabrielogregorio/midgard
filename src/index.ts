require('dotenv').config();

import express from 'express';
import { useCors } from './middlewares/useCors';
import { useHandleErrors } from './middlewares/useHandleErrors';
import { index } from './modules';
import fs from 'fs';
import path from 'path';
import { SchemaType } from './types';
import { readBaseConfigFile } from './modules/readBaseConfigFile';

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

let lastSchema: SchemaType[] = [];
let status = {
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
      fullSchema = fullSchema.concat(index(conf));
    });

    lastSchema = fullSchema;

    status.generateSchema = true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return;
    }

    console.error(error);
  }
}, TIME_TO_REFRESH_DOCS_IN_MS);

app.get('/', (req, res) => {
  return res.sendStatus(200);
});

app.get('/schema', (req, res) => {
  return res.json(lastSchema);
});

app.get('/status', (req, res) => {
  return res.json(status);
});

app.use(useHandleErrors);

app.listen(process.env.PORT);
