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

    expect(resultEnd).toEqual({
      content: [
        {
          markdown:
            '\n# Title\ntags: [frontend, adr]\ndocMdExample (./file1.png)\n[link](example)\n![./images/_.png](./images/_.png)\n![example.png](another)\n![./images/_docbytest_ref=example_12.png](./images/_docbytest_ref=example_12.png)\n'
        }
      ],
      tags: ['example', 'tag', 'name', 'frontend', 'adr'],
      title: 'Title'
    });
  });
});
