import { SchemaType } from '../types';
import { extractCommentDocs } from './extractCommentDocs';
import { extracTags } from './extractTags';
import { extractTitleDocs } from './extractTitle';
import { configFile } from './readConfigFile';

const NAME = 'process-comments';

export const processComments = (content: string, config: configFile): SchemaType[] => {
  const comments = extractCommentDocs(content);

  let resultEnd: SchemaType[] = [];

  comments.forEach((item) => {
    const title = extractTitleDocs(item.content || '');
    const extraTags = extracTags(item.content || '');

    resultEnd.push({
      title: title.title,
      originName: config.name,
      errors: [],
      handlerName: NAME,
      tags: [ ...extraTags],
      content: [{ markdown: item.content }]
    });
  });

  return resultEnd;
};
