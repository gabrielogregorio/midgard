import { handlerComments } from '.';

const mainInput = `
  /* doc\n# TitleExample\nvalor1\nvalor2\ntags:[localTag]*/
`;

const fileTags = ['file'];

describe('processComments', () => {
  it('processComments', () => {
    const resultEnd = handlerComments(mainInput, { context: 'example.tag', name: 'name' }, 'file', fileTags);

    expect(resultEnd).toEqual([
      {
        tags: ['file', 'localTag'],
        title: 'TitleExample',
        errors: [],
        handlerName: 'process-comments',
        originName: 'name',
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
