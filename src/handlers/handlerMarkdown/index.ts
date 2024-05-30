import { processHandlerType } from '../../modules/types';
import { SchemaType } from '../../types';
import { processMarkdown } from '../utils/processMarkdown/processMarkdown';

const NAME = 'process-markdown';

export const handlerMarkdown = (fileText: string, config: processHandlerType, filePath: string, fileTags: string[]): SchemaType[] => {
  if (!filePath.endsWith('.md') && !filePath.endsWith('.MD')) {
    return [];
  }

  const result = processMarkdown(fileText, config, filePath);

  const tags = result.tags ? result.tags : [];

  return [
    {
      ...result,
      originName: config.tags.join('.'),
      handlerName: NAME,
      tags: [...fileTags, ...tags]
    }
  ];
};
