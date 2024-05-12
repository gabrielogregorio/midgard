import { returnTypeExtractBlock } from './extractDevBlocks';
import { extracTags } from './extractTags';

describe('extracTags', () => {
  it('should extract tags', () => {
    const line: returnTypeExtractBlock[] = [
      {
        markdown: `up\n\n  \ntags: [doc endpoints, other, exemple]\ndown\ndown2`,
        type: 'normal'
      }
    ];
    const results = extracTags(line);

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
    const lineWithtopContent: returnTypeExtractBlock[] = [{ markdown: `example\ntags: [doc endpoints, other, exemple]`, type: 'normal' }];

    const results = extracTags(lineWithtopContent);

    expect(results).toEqual({
      content: [
        { markdown: 'example', type: 'md', subType: 'normal' },
        { markdown: 'tags: [doc endpoints, other, exemple]', type: 'tag', subType: 'normal' }
      ],
      tags: ['doc endpoints', 'other', 'exemple']
    });
  });
});
