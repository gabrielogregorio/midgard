import { SchemaType } from '../types';
import { swaggerParser } from '../utils/swaggerParser';
import { configFile } from './readConfigFile';

const regexGetUtilCommentSwagger = /\/\*\*\n\s*\*\s*@swagger([\s\S]*?\*\/)/gm;

const NAME = 'process-swagger';

export const processSwagger = (contentOriginal: string, config: configFile, file: string): SchemaType[] => {
  let content = contentOriginal;

  const matchs = [...content.matchAll(regexGetUtilCommentSwagger)];

  const onlyRequestsDocSwaggerIgnoringComponents = matchs.filter((item) => {
    return item[1].includes('components:') === false;
  });

  if (!onlyRequestsDocSwaggerIgnoringComponents.length) {
    return [];
  }

  return onlyRequestsDocSwaggerIgnoringComponents.map((item) => {
    const result = swaggerParser(item[1]);
    if (!result.yaml || result.error) {
      return {
        tags: ['swagger', 'endpoint'],
        errors: [`Erro ao obter Dados do Swagger do contexto "${config.context}.${config.name}" e arquivo "${file}" error ${result.error}`],
        originName: config.name,
        content: [],
        handlerName: NAME,
        title: 'Obter Documentação do Swagger'
      };
    }
    const path = Object.keys(result.yaml)[0];
    const dataPath = result.yaml[path];

    const method = Object.keys(dataPath)[0];
    const dataMethod = dataPath[method];

    let description = dataMethod.description ? dataMethod.description : '';
    let summary = dataMethod.summary ? dataMethod.summary : '';
    const tags = Array.isArray(dataMethod.tags) ? dataMethod.tags : [];

    const title = summary || description;
    const makdownFinal = summary ? `# ${summary}\n${description}` : description;

    return {
      tags: ['swagger', 'endpoint', method, path, ...tags],
      originName: config.name,
      handlerName: NAME,
      content: [{ markdown: makdownFinal, type: 'md', subType: 'normal' }],
      title: title as string
    };
  });
};
