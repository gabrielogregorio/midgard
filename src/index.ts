require('dotenv').config();

import express from 'express';
import { useCors } from './middlewares/useCors';
import { useHandleErrors } from './middlewares/useHandleErrors';
import { index, inputSchemasType } from './modules';

const app = express();
app.disable('x-powered-by');

app.use(useCors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let lastSchema: inputSchemasType[] = [];
let status = {
  generateSchema: false,
  error: false
};
const TIME_TO_REFRESH_DOCS_IN_MS = 1000;
setInterval(() => {
  try {

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

app.get('/schemas', (req, res) => {
  return res.json(lastSchema);
});

app.get('/status', (req, res) => {
  return res.json(status);
});

app.use(useHandleErrors);

app.listen(process.env.PORT);
