import express from 'express';
import { useCors } from './middlewares/useCors';
import { useHandleErrors } from './middlewares/useHandleErrors';
import { SchemaType } from './types';
import { hierarchyType } from './modules/types';
import { statusCode } from './utils/statusCode';
import { CONFIG_FILE } from './config/envs';
import { processSchema } from './processSchema';

const app = express();

app.disable('x-powered-by');
app.use(express.static('public'));
app.use(useCors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let lastSchema: { schema: SchemaType[]; hierarchy: hierarchyType[] } = { schema: [], hierarchy: [] };

const result = processSchema(CONFIG_FILE);
if (result) {
  lastSchema = result;
}

app.get('/', (_req, res) => res.sendStatus(statusCode.SUCCESS));

app.get('/schema', (_req, res) => res.json(lastSchema));

app.use(useHandleErrors);

app.listen(process.env.PORT);
