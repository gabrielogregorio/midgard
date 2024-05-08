import { processComments } from './processComments';

const mainInput = `
  /* doc\n# TitleExample\nvalor1\nvalor2*/
`;

describe('', () => {
  it('', () => {
    let resultEnd = processComments(mainInput, { context: 'example.tag', name: 'name' });

    expect(resultEnd).toEqual([
      {
        tags: ['example', 'tag', 'name'],
        title: 'TitleExample',
        content: [
          {
            markdown: '\n# TitleExample\nvalor1\nvalor2'
          }
        ]
      }
    ]);
  });
});
