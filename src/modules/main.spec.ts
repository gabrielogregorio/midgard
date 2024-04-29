import { Context, PageType } from '../types';
import { Main } from './main';

const mainInput = `
/* doc-request
REQUEST: POST /users\nEndpoint que realiza abc\n*/


  /* doc-request-rules
  REQUEST: POST /users\nvalor1\nvalor2 */
`;

describe('', () => {
  it('', () => {
    let context: Context = {
      file: './example/file.ts'
    };

    let resultEnd: PageType[] = Main.process(mainInput, context);

    expect(resultEnd).toEqual([
      { description: '\n\nEndpoint que realiza abc\n', name: 'POST/users', method: 'POST', path: '/users' },
      {
        markdown: '\n  \nvalor1\nvalor2 '
      }
    ]);
  });
});
