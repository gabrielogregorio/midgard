import { configFile } from '../../modules/readConfigFile';
import { SchemaType } from '../../types';
import { processMarkdown } from '../utils/processMarkdown/processMarkdown';

const NAME = 'process-markdown';

export const handlerMarkdown = (fileText: string, config: configFile, filePath: string, fileTags: string[]): SchemaType[] => {
  if (!filePath.endsWith('.md') && !filePath.endsWith('.MD')) {
    return [];
  }

  const result = processMarkdown(fileText, config, filePath);

  const tags = result.tags ? result.tags : [];

  return [
    {
      ...result,
      originName: config.name,
      handlerName: NAME,
      tags: [...fileTags, ...tags]
    }
  ];
};
