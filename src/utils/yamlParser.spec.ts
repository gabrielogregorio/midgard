import { yamlParser } from './yamlParser';

describe('', () => {
  it('', () => {
    const mainInput = `
  /example/endpoint/:
    exampleMethod:
      tags: [exampleTag]
      descriptionMulti: |
        exampleMultiple
        exampleMultiple2
      description: example description
      requestBody:
        x-name: body
        content:
          application/json:
            schema:
              - item1
              - item2
              - item1
`;

    const data = yamlParser(mainInput);
    expect(data).toStrictEqual({
      error: '',
      yaml: {
        '/example/endpoint/': {
          exampleMethod: {
            tags: ['exampleTag'],
            descriptionMulti: 'exampleMultiple\nexampleMultiple2\n',
            description: 'example description',
            requestBody: { 'x-name': 'body', content: { 'application/json': { schema: ['item1', 'item2', 'item1'] } } }
          }
        }
      }
    });
  });

  it('', () => {
    const mainInput = `
example: invalid: example
`;

    const data = yamlParser(mainInput);
    expect(data).toStrictEqual({
      error: expect.stringMatching('Erro ao realizar parser "YAMLException", message "bad indentation of a mapping'),
      yaml: null
    });
  });
});
