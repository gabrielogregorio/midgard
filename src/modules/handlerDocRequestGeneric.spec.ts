import { CustomError } from '../error';
import { extractDocRequestGeneric } from './handlerDocRequestGeneric';

const input = {
  type: 'doc-request',
  content: `REQUEST: POST /example/request

Endpoint que realiza alguma coisa
`
};

// TODO: handle with complex cases REQUEST: POST /example/request/$param?example=example
describe('extractDocRequestGeneric - type doc-request', () => {
  it('should extract method and url', () => {
    const result = extractDocRequestGeneric(input.content, {
      file: './example/file.ts'
    });

    expect(result?.method).toEqual('POST');
    expect(result?.url).toEqual('/example/request');
    expect(result?.doc).toEqual('\n\nEndpoint que realiza alguma coisa\n');
  });

  it('should throw error on try extract data from invalid doc string', () => {
    const run = () => {
      extractDocRequestGeneric('invalid doc \nexample', {
        file: './example/file.ts'
      });
    };

    expect(run).toThrow(CustomError);
    expect(run).toThrowError('error on extract method and url from string ""invalid doc \\nexample"" in file ./example/file.ts');
  });
});
