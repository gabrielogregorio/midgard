import { SchemaType } from '../types';
import { extractCommentDocs } from './extractCommentDocs';
import { extracTags } from './extractTags';
import { extractTitleDocs } from './extractTitle';
import { configFile } from './readConfigFile';

export const processComments = (content: string, config: configFile): SchemaType[] => {
  const comments = extractCommentDocs(content);
  const fullcontext = (config.context + '.' + config.name).split('.');

  let resultEnd: SchemaType[] = [];

  comments.forEach((item) => {
    const title = extractTitleDocs(item.content || '');
    const extraTags = extracTags(item.content || '');

    resultEnd.push({
      title: title.title,
      originName: config.name,
      errors: [],
      tags: [...fullcontext, ...extraTags],
      content: [{ markdown: item.content }]
    });
  });

  return resultEnd;
};
