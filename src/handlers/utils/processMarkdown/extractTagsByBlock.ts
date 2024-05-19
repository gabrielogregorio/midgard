import { SchemaType } from '../../../types';
import { extractDevBlocksReturnType } from './extractDevBlocks';

const extractDocRequest = /^[\s*]*tags\s*:\s*\[*(.*)\]/g;

type extractTagsReturnType = {
  blocks: SchemaType['blocks'];
  tags: string[];
};

export const extractTagsByBlock = (blocks: extractDevBlocksReturnType[]): extractTagsReturnType => {
  const tagsReturn: extractTagsReturnType = {
    blocks: [],
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
        tagsReturn.blocks.push({
          type: 'md',
          subType: block.type,
          markdown: body
        });
        body = '';
      }

      const tags = matchTags[0][1].split(',').map((tag) => tag.trim());

      tagsReturn.tags = tagsReturn.tags.concat(tags);
      tagsReturn.blocks.push({
        type: 'tag',
        subType: block.type,
        markdown: line
      });
    });

    if (body) {
      tagsReturn.blocks.push({
        type: 'md',
        subType: block.type,
        markdown: body
      });
      body = '';
    }
  });

  return tagsReturn;
};
