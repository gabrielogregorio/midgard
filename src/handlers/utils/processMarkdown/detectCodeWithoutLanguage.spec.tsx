import { detectCodeWithoutLanguage } from './detectCodeWithoutLanguage';

const input = `
\`\`\`ts
example
\`\`\`

example

\`\`\`
other code
\`\`\`

other 

\`\`\`ts


\`\`\`


`;

describe('', () => {
  it('', () => {
    const result = detectCodeWithoutLanguage(input);

    expect(result).toEqual([
      {
        type: 'code-without-language',
        file: '',
        code: `\n\`\`\`\nother code\n\`\`\``
      }
    ]);
  });
});
