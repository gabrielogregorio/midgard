import { processComments } from './processComments';

const mainInput = `
  /* doc\n# TitleExample\nvalor1\nvalor2\ntags:[localTag]*/
`;

describe('', () => {
  it('', () => {
    let resultEnd = processComments(mainInput, { context: 'example.tag', name: 'name' });

    expect(resultEnd).toEqual([
      {
        tags: ['localTag'],
        title: 'TitleExample',
        errors: [],
        handlerName: 'process-comments',
        originName: 'name',
        content: [
          {
            markdown: '\n# TitleExample\nvalor1\nvalor2\ntags:[localTag]'
          }
        ]
      }
    ]);
  });
});
