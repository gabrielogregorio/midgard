/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAPI3, OperationObject, ReferenceObject } from 'openapi-typescript';
import { SchemaType, swaggerRequestType } from '../../types';
import { configFile } from '../../modules/readConfigFile';
import { LogService } from '../../services/log';
import { openApi3ToJson } from './openApiToJson';
import { referenceApplicationJsonHeader } from '../handlerCollectHttp/utils';

const handlerNameOpenApi3 = 'open-api-3';

export const handlerOpenApi3 = (fileText: string, config: configFile, filePath: string, fileTags: string[]): SchemaType[] => {
  if (!filePath.endsWith('.json')) {
    return [];
  }

  let model: OpenAPI3;
  try {
    model = JSON.parse(fileText) as OpenAPI3;
    if (String(model?.openapi).startsWith('3.') === false) {
      if (model?.openapi) {
        LogService.error(`model open api don't mapped, file "${filePath}" version "${model.openapi}"`);
      }
      return [];
    }
  } catch (error) {
    LogService.error('ERRO AO LER JSON', error);
    return [];
  }

  LogService.info(`filePath=${filePath}`);
  const results: SchemaType[] = [];

  const title = model?.info?.title?.toString();
  const description = model?.info?.description?.toString();
  const errors: string[] = [];

  Object.keys(model.paths || {}).forEach((path) => {
    const methods = model!.paths![path as keyof typeof model.paths];

    Object.keys(methods).forEach((method) => {
      if ('paths' in model === false || model.paths === undefined) {
        errors.push(`expect model has "path" key, but not has in "${filePath}" with data "${JSON.stringify(model)}"`);
        return;
      }

      const request = model.paths[path][method as any] as OperationObject | ReferenceObject;
      if (method === 'servers' || method === 'parameters') {
        errors.push(`method don't mapped in file "${filePath}" with data "${JSON.stringify(method)}"`);
        return;
      }

      if ('$ref' in request) {
        // TODO: resolve reference
        errors.push(`Método é referência in file "${filePath}" with data "${JSON.stringify(request)}"`);
        return;
      }

      let payload = '';
      try {
        // @ts-ignore
        const requestSchema = request?.requestBody?.content?.[referenceApplicationJsonHeader]?.schema;
        payload = requestSchema ? openApi3ToJson(requestSchema, model).data : '';
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error.message);
        } else {
          errors.push(`Error on handle open api in to json ${error} in file "${filePath}"`);
        }
      }

      const responses = request?.responses;

      // @ts-ignore
      const codes = Object.keys(responses);
      if (!codes?.length) {
        errors.push(`Não foram encontradops cenários, era esperado que houvessem exemplos de respostas`);
      }

      const sceneries: swaggerRequestType['sceneries'] = codes.map((code) => {
        // @ts-ignore
        const scenarie = responses[code];

        let payloadBase = '';
        // @ts-ignore
        const ref = scenarie?.content?.[referenceApplicationJsonHeader]?.schema;
        if (ref) {
          // @ts-ignore
          payloadBase = openApi3ToJson(ref, {} as OpenAPI3).data;
          // @ts-ignore
        }

        return {
          headers: {},
          summary: scenarie?.description || '',
          payload,
          params: {},
          description: '',
          response: {
            example: payloadBase || 'Sem exemplo',
            status: Number(code)
          }
        };
      });

      const requestDescription = request.description || `Swagger ${method} ${path}`;
      const blockRequest: swaggerRequestType = {
        type: 'openApi3',
        description: `# ${title}\n\n${description}\n\n${requestDescription}`,
        method,
        summary: '',
        url: path,
        sceneries
      };

      const tagsRequest = request.tags ? request.tags : [];

      results.push({
        title: `${request.summary || model.info.title || 'Sem titulo'} ${method} ${path}`,
        errors,
        warning: [],
        tags: [...fileTags, ...tagsRequest],
        blocks: [blockRequest],
        originName: config.name,
        handlerName: handlerNameOpenApi3
      });
    });
  });

  return results;
};
