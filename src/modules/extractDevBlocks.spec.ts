import { extractDevBlocks } from './extractDevBlocks';

describe('extractDevBlocks', () => {
  it('should extract dev block and normal block with spaces and break lines', () => {
    const input = `item1  
item2  
<!-- dev:start -->
item3
item4  
<!-- dev:end -->
item5
<!-- dev:start -->
item6
item7
<!-- dev:end -->
item8`;

    expect(extractDevBlocks(input)).toEqual([
      { markdown: 'item1  \nitem2  ', type: 'normal' },
      { markdown: 'item3\nitem4  ', type: 'dev' },
      { markdown: 'item5', type: 'normal' },
      { markdown: 'item6\nitem7', type: 'dev' },
      { markdown: 'item8', type: 'normal' }
    ]);
  });

  it('should extract only dev block wit spaces', () => {
    const input = `<!-- dev:start -->
item1  
item2
<!-- dev:end -->
`;

    expect(extractDevBlocks(input)).toEqual([{ markdown: 'item1  \nitem2', type: 'dev' }]);
  });

  it('should extract only normal block with spaces', () => {
    const input = `  item1\nitem2`;

    expect(extractDevBlocks(input)).toEqual([{ markdown: '  item1\nitem2', type: 'normal' }]);
  });

  it('should extract normal block and ignore empty dev block', () => {
    const input = `item1
<!-- dev:start -->
<!-- dev:end -->
`;

    expect(extractDevBlocks(input)).toEqual([{ markdown: 'item1', type: 'normal' }]);
  });
});
