/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/cognitive-complexity */
import { OpenAPI3 } from 'openapi-typescript';
import { configFile } from '../../modules/readConfigFile';
import { SchemaType, swaggerRequestType } from '../../types';
import { openApi3ToJson } from '../handlerOpenApi3/openApiToJson';
import { swaggerParser } from './swaggerParser';
import { referenceApplicationJsonHeader } from '../handlerCollectHttp/utils';

const regexGetUtilCommentSwagger = /\/\*\*\n\s*\*\s*@swagger([\s\S]*?\*\/)/gm;

const NAME = 'process-swagger';

export const handlerSwagger = (fileText: string, config: configFile, filePath: string, fileTags: string[]): SchemaType[] => {
  const content = fileText;

  const match = [...content.matchAll(regexGetUtilCommentSwagger)];

  const onlyRequestsDocSwaggerIgnoringComponents = match.filter((item) => item[1].includes('components:') === false);

  if (!onlyRequestsDocSwaggerIgnoringComponents.length) {
    return [];
  }

  return onlyRequestsDocSwaggerIgnoringComponents.map((item) => {
    const result = swaggerParser(item[1]);
    let errors: string[] = [];

    if (!result.yaml || result.error) {
      return {
        tags: ['swagger', 'endpoint'],
        errors: [`Error on parse swagger doc to yaml, from file "${filePath}" error ${result.error}`],
        originName: config.name,
        blocks: [],
        handlerName: NAME,
        title: 'Erro ao obter documentação do swagger'
      };
    }
    const path = Object.keys(result.yaml)[0];
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataPath = result.yaml[path] as any;

    const method = Object.keys(dataPath)[0];
    const dataMethod = dataPath[method];

    const description = dataMethod.description ? dataMethod.description : '';
    const summary = dataMethod.summary ? dataMethod.summary : '';
    const tags = Array.isArray(dataMethod.tags) ? dataMethod.tags : [];

    const title = summary || description;

    let payload = '';
    const model = dataMethod?.requestBody?.content?.[referenceApplicationJsonHeader]?.schema;
    if (model) {
      try {
        const result2 = openApi3ToJson(model, {} as OpenAPI3);
        payload = result2.data;

        if (result2.errors.length) {
          errors = errors.concat(result2.errors);
        }
      } catch (error) {
        if (error instanceof Error) {
          errors.push(`Error on parse schema "${JSON.stringify(model)}" to open api format, error message "${error.message}" `);
        } else {
          errors.push(`Error on parse schema "${JSON.stringify(model)}" to open api format, error "${error}" `);
        }
      }
    }

    const { responses } = dataMethod;
    // @ts-ignore

    const responsesFinal: {
      status: number;
      description: string;
      example: unknown;
    }[] = [];
    if (responses) {
      const status = Object.keys(responses);

      status.forEach((statusItem) => {
        const statusModel = responses[statusItem].content?.[referenceApplicationJsonHeader];
        const descriptionLocal: string = responses[statusItem].description || '';
        if (statusModel && statusModel.example) {
          const example = statusModel.example ? statusModel.example : '';

          responsesFinal.push({
            status: Number(statusItem),
            description: descriptionLocal,
            example
          });
        }
      });
    }

    if (responsesFinal.length === 0) {
      responsesFinal.push({
        description: 'Sem exemplos de resposta',
        example: '',
        status: 0
      });
    }

    const params: swaggerRequestType['sceneries'][0]['params'] = {};
    const sceneries: swaggerRequestType['sceneries'] = responsesFinal.map((response) => {
      // @ts-ignore
      dataMethod?.parameters?.forEach((param) => {
        if (param?.in !== 'path') {
          // eslint-disable-next-line no-console
          console.error(`Parametro não mapeado ${param?.in}`);
          return;
        }
        const paramsItems = Object.keys(param?.examples || {})
          ? Object.keys(param?.examples || {}).map((example) => param?.examples[example]?.value)
          : [];
        // @ts-ignore
        params[param.name] = {
          description: param.description,
          examples: [param?.example, ...paramsItems].filter((paramLocal) => paramLocal)
        };
      });

      return {
        params: {},
        summary,
        description: response.description,
        headers: {},
        payload,
        response: {
          example: response.example,
          status: response.status
        }
      };
    });

    const request: swaggerRequestType = {
      type: 'openApi3',
      method,
      description,
      summary,
      url: path,
      sceneries: sceneries.map((scene) => ({
        ...scene,
        params
      }))
    };
    return {
      tags: [...fileTags, 'swagger', 'endpoint', method, path, ...tags],
      originName: config.name,
      handlerName: NAME,
      errors,
      blocks: [request],
      title: title as string
    };
  });
};
