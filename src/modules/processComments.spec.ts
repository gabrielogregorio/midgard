import { processComments } from './processComments';

const mainInput = `
  /* doc\n# TitleExample\nvalor1\nvalor2\ntags:[localTag]*/
`;

describe('processComments', () => {
  it('processComments', () => {
    const resultEnd = processComments(mainInput, { context: 'example.tag', name: 'name' }, 'file');

    expect(resultEnd).toEqual([
      {
        tags: ['file', 'localTag'],
        title: 'TitleExample',
        errors: [],
        handlerName: 'process-comments',
        originName: 'name',
        content: [
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
