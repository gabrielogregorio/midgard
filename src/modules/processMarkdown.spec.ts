import * as generateId from '../utils/generateId';
import { processMarkdown } from './processMarkdown';

process.env.PORT = '3333';

const spy = jest.spyOn(generateId, 'generateId');
spy.mockImplementation(() => 'idMock');

describe('processMarkdown', () => {
  it('processMarkdown', () => {
    const mainInput = `
# Title
tags: [frontend, adr]
  docMdExample (./file1.png)  
[link](example)
[example local reference](./myFile.md)
![./images/_.png](./images/_.png)
![version](./example.png)
![./images/_docbytest_ref=example_12.png](./images/_docbytest_ref=example_12.png)
`;

    const fileInput = './docs/adr/file.md';

    const resultEnd = processMarkdown(mainInput, { context: 'example.tag', name: 'name' }, fileInput);

    // fix generate id
    expect(resultEnd).toStrictEqual({
      content: [
        {
          markdown: `# Title`,
          type: 'md',
          subType: 'normal'
        },

        {
          markdown: `tags: [frontend, adr]`,
          type: 'tag',
          subType: 'normal'
        },

        {
          markdown: `  docMdExample (./file1.png)  
[ref.example.tag.name.example]
[ref.example.tag.name.myFile.md]
![./images/_.png](http://localhost:3333/idMock.png)
![version](http://localhost:3333/idMock.png)
![./images/_docbytest_ref=example_12.png](http://localhost:3333/idMock.png)\n`,
          type: 'md',
          subType: 'normal'
        }
      ],
      tags: ['docs', 'adr', 'file', 'md', 'frontend', 'adr'],
      handlerName: 'process-markdown',
      warning: [],
      errors: [
        'erro ao copiar docs/adr/images/_.png para ./public/idMock.png',
        'erro ao copiar docs/adr/example.png para ./public/idMock.png',
        'erro ao copiar docs/adr/images/_docbytest_ref=example_12.png para ./public/idMock.png'
      ],
      originName: 'name',
      title: 'Title'
    });
  });

  it('processMarkdown', () => {
    const mainInput = `
# Title

example markdonw 

with multiples lines
`;

    const fileInput = './docs/adr/file.md';

    const resultEnd = processMarkdown(mainInput, { context: 'example.tag', name: 'name' }, fileInput);

    // fix generate id
    expect(resultEnd).toStrictEqual({
      content: [
        {
          markdown: `# Title

example markdonw 

with multiples lines
`,
          type: 'md',
          subType: 'normal'
        }
      ],
      tags: ['docs', 'adr', 'file', 'md'],
      handlerName: 'process-markdown',
      warning: [],
      errors: [],
      originName: 'name',
      title: 'Title'
    });
  });
});
