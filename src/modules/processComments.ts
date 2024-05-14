import { SchemaType } from '../types';
import { extractCommentDocs } from './extractCommentDocs';
import { processMarkdown } from './processMarkdown';
import { configFile } from './readConfigFile';

const NAME = 'process-comments';

export const processComments = (code: string, config: configFile, file: string): SchemaType[] => {
  const comments = extractCommentDocs(code);

  const commentsFounded: SchemaType[] = [];

  comments.forEach((comment) => {
    const markdown = processMarkdown(comment.content, config, file);

    commentsFounded.push({
      title: markdown.title,
      originName: markdown.originName,
      errors: markdown.errors,
      handlerName: NAME,
      tags: markdown?.tags,
      content: markdown.content
    });
  });

  return commentsFounded;
};
