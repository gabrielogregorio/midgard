import { processMarkdown } from './processMarkdown';

describe('', () => {
  it('', () => {
    const mainInput = `
# Title
tags: [frontend, adr]
docMdExample (./file1.png)
[link](example)
![./images/_.png](./images/_.png)
![example.png](another)
![./images/_docbytest_ref=example_12.png](./images/_docbytest_ref=example_12.png)
`;

    const fileInput = './docs/adr/file.md';

    let resultEnd = processMarkdown(mainInput, { context: 'example.tag', name: 'name' }, fileInput);

    // fix generate id
    expect(resultEnd).toStrictEqual({
      content: [
        {
          markdown: expect.anything() // mock random and timers
        }
      ],
      tags: ['docs', 'adr', 'file', 'md', 'frontend', 'adr'],
      handlerName: 'process-markdown',
      errors: [
        expect.stringMatching('erro ao copiar docs/adr/images/_.png para'),
        expect.stringMatching('erro ao copiar docs/adr/images/_docbytest_ref=example_12.png para')
      ],
      originName: 'name',
      title: 'Title'
    });
  });
});
