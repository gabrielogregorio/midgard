import { detectCodeWithoutLanguage } from './detectCodeWithoutLanguage';

const texto = `
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
    const result = detectCodeWithoutLanguage(texto);

    expect(result).toEqual([
      {
        type: 'code-without-language',
        file: '',
        code: `\n\`\`\`\nother code\n\`\`\``
      }
    ]);
  });
});
