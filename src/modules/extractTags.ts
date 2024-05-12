import { SchemaType } from '../types';
import { returnTypeExtractBlock } from './extractDevBlocks';

const extractDocRequest = /^[\s\*]*tags\s*:\s*\[*(.*)\]/g;

type returnType = {
  content: SchemaType['content'];
  tags: string[];
};

export const extracTags = (contentX: returnTypeExtractBlock[]): returnType => {
  let tags: returnType = {
    content: [],
    tags: []
  };

  contentX.forEach((content) => {
    let body = '';
    content.markdown.split('\n').forEach((line) => {
      const results = [...line.matchAll(extractDocRequest)];
      if (!results.length) {
        body += body ? '\n' + line : line;
        return;
      }

      if (body) {
        tags.content.push({
          type: 'md',
          subType: content.type,
          markdown: body
        });
        body = '';
      }

      const localTags = results[0][1].split(',').map((item) => item.trim());

      tags.tags = tags.tags.concat(localTags);
      tags.content.push({
        type: 'tag',
        subType: content.type,
        markdown: line
      });
    });

    if (body) {
      tags.content.push({
        type: 'md',
        subType: content.type,
        markdown: body
      });
      body = '';
    }
  });

  return tags;
};
