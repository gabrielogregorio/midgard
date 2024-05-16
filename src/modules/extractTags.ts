import { SchemaType } from '../types';
import { extractDevBlocksReturnType } from './extractDevBlocks';

const extractDocRequest = /^[\s*]*tags\s*:\s*\[*(.*)\]/g;

type extractTagsReturnType = {
  content: SchemaType['content'];
  tags: string[];
};

export const extractTags = (blocks: extractDevBlocksReturnType[]): extractTagsReturnType => {
  const tagsReturn: extractTagsReturnType = {
    content: [],
    tags: []
  };

  blocks.forEach((block) => {
    let body = '';

    block.markdown.split('\n').forEach((line) => {
      const matchTags = [...line.matchAll(extractDocRequest)];
      if (!matchTags.length) {
        body += body ? `\n${line}` : line;
        return;
      }

      if (body) {
        tagsReturn.content.push({
          type: 'md',
          subType: block.type,
          markdown: body
        });
        body = '';
      }

      const tags = matchTags[0][1].split(',').map((item) => item.trim());

      tagsReturn.tags = tagsReturn.tags.concat(tags);
      tagsReturn.content.push({
        type: 'tag',
        subType: block.type,
        markdown: line
      });
    });

    if (body) {
      tagsReturn.content.push({
        type: 'md',
        subType: block.type,
        markdown: body
      });
      body = '';
    }
  });

  return tagsReturn;
};
