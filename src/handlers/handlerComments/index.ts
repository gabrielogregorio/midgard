import { configFile } from '../../modules/readConfigFile';
import { SchemaType } from '../../types';
import { extractCommentDocs } from '../utils/processMarkdown/extractCommentDocs';
import { processMarkdown } from '../utils/processMarkdown/processMarkdown';

const NAME = 'process-comments';

export const handlerComments = (fileText: string, config: configFile, filePath: string,fileTags: string[]): SchemaType[] => {
  const comments = extractCommentDocs(fileText);

  const commentsFounded: SchemaType[] = [];

  comments.forEach((comment) => {
    const markdown = processMarkdown(comment.content, config, filePath);

    const tags = markdown?.tags ? markdown?.tags : [];
    commentsFounded.push({
      title: markdown.title,
      originName: config.name,
      errors: markdown.errors,
      handlerName: NAME,
      tags: [...fileTags, ...tags],
      blocks: markdown.blocks
    });
  });

  return commentsFounded;
};
