import { configFile } from '../../modules/readConfigFile';
import { SchemaType } from '../../types';
import { swaggerParser } from './swaggerParser';

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
    if (!result.yaml || result.error) {
      return {
        tags: ['swagger', 'endpoint'],
        errors: [
          `Erro ao obter Dados do Swagger do contexto "${config.context}.${config.name}" e arquivo "${filePath}" error ${result.error}`
        ],
        originName: config.name,
        blocks: [],
        handlerName: NAME,
        title: 'Obter Documentação do Swagger'
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
    const markdownFinal = summary ? `# ${summary}\n${description}` : description;

    return {
      tags: [...fileTags, 'swagger', 'endpoint', method, path, ...tags],
      originName: config.name,
      handlerName: NAME,
      blocks: [{ markdown: markdownFinal, type: 'md', subType: 'normal' }],
      title: title as string
    };
  });
};
