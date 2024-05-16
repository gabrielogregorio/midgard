import { extractDevBlocksReturnType } from './extractDevBlocks';
import { extractTags } from './extractTags';

describe('extractTags', () => {
  it('should extract tags', () => {
    const line: extractDevBlocksReturnType[] = [
      {
        markdown: `up\n\n  \ntags: [doc endpoints, other, exemple]\ndown\ndown2`,
        type: 'normal'
      }
    ];
    const results = extractTags(line);

    expect(results).toEqual({
      content: [
        { markdown: 'up\n\n  ', type: 'md', subType: 'normal' },
        { markdown: 'tags: [doc endpoints, other, exemple]', type: 'tag', subType: 'normal' },
        { markdown: 'down\ndown2', type: 'md', subType: 'normal' }
      ],
      tags: ['doc endpoints', 'other', 'exemple']
    });
  });

  it('should extract tags', () => {
    const lineWithoutContent: extractDevBlocksReturnType[] = [
      { markdown: `example\ntags: [doc endpoints, other, exemple]`, type: 'normal' }
    ];

    const results = extractTags(lineWithoutContent);

    expect(results).toEqual({
      content: [
        { markdown: 'example', type: 'md', subType: 'normal' },
        { markdown: 'tags: [doc endpoints, other, exemple]', type: 'tag', subType: 'normal' }
      ],
      tags: ['doc endpoints', 'other', 'exemple']
    });
  });
});
