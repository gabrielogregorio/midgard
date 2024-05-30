import { handlerComments } from '.';

const mainInput = `
  /* doc\n# TitleExample\nvalor1\nvalor2\ntags:[localTag]*/
`;

const fileTags = ['file'];

describe('processComments', () => {
  it('processComments', () => {
    const resultEnd = handlerComments(
      mainInput,
      { tags: ['example', 'tag', 'name'], bannedPaths: [], directory: '', title: '' },
      'file',
      fileTags
    );

    expect(resultEnd).toEqual([
      {
        tags: ['file', 'localTag'],
        title: 'TitleExample',
        errors: [],
        handlerName: 'process-comments',
        originName: 'example.tag.name',
        blocks: [
          {
            markdown: '# TitleExample\nvalor1\nvalor2',
            type: 'md',
            subType: 'normal'
          },
          { markdown: 'tags:[localTag]', type: 'tag', subType: 'normal' }
        ]
      }
    ]);
  });
});
