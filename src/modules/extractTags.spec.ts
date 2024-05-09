import { extracTags } from './extractTags';

const line = `

tags: [doc endpoints, other, exemple]

`;

const lineWithtopContent = `

example

tags: [doc endpoints, other, exemple]

`;

describe('extracTags', () => {
  it('should extract tags', () => {
    const results = extracTags(line);

    expect(results).toEqual(['doc endpoints', 'other', 'exemple']);
  });

  it('should extract tags', () => {
    const results = extracTags(lineWithtopContent);

    expect(results).toEqual(['doc endpoints', 'other', 'exemple']);
  });
});
