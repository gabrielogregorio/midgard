import { getBlockDocs } from './getBlockDocs';

describe('getBlockDocs', () => {
  it('should get empty block', () => {
    expect(getBlockDocs('')).toEqual([]);
  });

  it('should get a block', () => {
    expect(getBlockDocs('### block')).toEqual(['### block']);
  });

  it('should get a block with multiple lines', () => {
    expect(getBlockDocs('### text1\ntext2')).toEqual(['### text1\ntext2']);
  });

  it('should get a blocks', () => {
    expect(getBlockDocs('### text1\n### text2')).toEqual(['### text1', '### text2']);
  });

  it('should get a blocks', () => {
    expect(getBlockDocs('##### text1\n### text2')).toEqual(['##### text1', '### text2']);
  });

  it('should get a blocks with multiples #', () => {
    expect(getBlockDocs('##### text1\n##### text2')).toEqual(['##### text1', '##### text2']);
  });

  it('should get a blocks with multiples #', () => {
    expect(getBlockDocs('text1\n###\n text2')).toEqual(['text1', '###\n text2']);
  });
});
