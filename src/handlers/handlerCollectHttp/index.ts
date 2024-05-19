import { configFile } from '../../modules/readConfigFile';
import { SchemaType } from '../../types';
import { getBlockDocs } from './getBlockDocs';
import { processDocBlock } from './processDocBlock';
import { handlerNameCollectHttp } from './utils';

export const handlerCollectHttp = (fileText: string, config: configFile, filePath: string, fileTags: string[]): SchemaType[] => {
  if (filePath.endsWith('.http') === false) {
    return [];
  }

  const docs: SchemaType[] = [];

  let variables: { [key: string]: string } = {};

  const blocks = getBlockDocs(fileText);
  blocks.forEach((block) => {
    const result = processDocBlock(block, config, filePath, variables);

    variables = { ...result.variables };
    docs.push({
      title: result.title,
      errors: result.errors,
      warning: result.warning,
      tags: [...fileTags, ...result.tags],
      blocks: result.blocks,
      originName: config.name,
      handlerName: handlerNameCollectHttp
    });
  });

  return docs;
};
