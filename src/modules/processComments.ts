import { SchemaType } from '../types';
import { extractCommentDocs } from './extractCommentDocs';
import { processMarkdown } from './processMarkdown';
import { configFile } from './readConfigFile';

const NAME = 'process-comments';

export const processComments = (content: string, config: configFile, file: string): SchemaType[] => {
  const comments = extractCommentDocs(content);

  let resultEnd: SchemaType[] = [];

  comments.forEach((item) => {
    const result = processMarkdown(item.content, config, file);

    resultEnd.push({
      title: result.title,
      originName: result.originName,
      errors: result.errors,
      handlerName: NAME,
      tags: result?.tags,
      content: result.content
    });
  });

  return resultEnd;
};
