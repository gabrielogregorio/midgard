import { detectCodeWithoutLanguage } from './detectCodeWithoutLanguage';
import { codeWithoutLanguage } from './utils';

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
        message: codeWithoutLanguage,
        code: `\n\`\`\`\nother code\n\`\`\``
      }
    ]);
  });
});
