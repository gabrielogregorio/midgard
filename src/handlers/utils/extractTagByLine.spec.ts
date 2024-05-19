import { extractTagByLine } from './extractTagByLine';

describe('extractTagByLine', () => {
  it('should extract empty list because not exist tag', () => {
    expect(extractTagByLine('any content')).toEqual([]);
  });

  it('should return empty tag list', () => {
    expect(extractTagByLine('tags: []')).toEqual([]);
  });

  it('should return tag items', () => {
    expect(extractTagByLine('tags: [tag1]')).toEqual(['tag1']);
  });

  it('should return tag items with many spaces', () => {
    expect(extractTagByLine('tags   :   [tag1]')).toEqual(['tag1']);
  });

  it('should return tag items with non spaces', () => {
    expect(extractTagByLine('tags:[tag1]')).toEqual(['tag1']);
  });

  it('should return tag items and phases', () => {
    expect(extractTagByLine('tags: [tag1, tag2, tag3, 123, false, frase qualquer]')).toEqual([
      'tag1',
      'tag2',
      'tag3',
      '123',
      'false',
      'frase qualquer'
    ]);
  });
});
