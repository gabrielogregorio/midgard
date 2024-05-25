/* eslint-disable sonarjs/no-duplicate-string */
import { handlerCollectHttp } from '.';
import { handlerNameCollectHttp, referenceApplicationJsonHeader } from './utils';

const fileInput = './docs/adr/file.http';

const configFile = { context: 'example.tag', name: 'name' };

const fileTags = ['docs', 'adr', 'file', 'http'];

describe('handlerCollectHttp', () => {
  it('should extract simple get request', () => {
    const input = `
GET exampleUrl HTTP/1.1
`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '#    ',
            subType: 'normal',
            type: 'md'
          },
          {
            method: 'GET',
            type: 'openApi3',
            url: 'exampleUrl',
            summary: '',
            description: '',

            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {},
                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: ''
              }
            ]
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'GET', 'exampleUrl', 'endpoint'],
        title: 'GET exampleUrl',
        warning: []
      }
    ]);
  });

  it('should extract multiples request with empty title ', () => {
    const input = `
###
GET exampleUrl HTTP/1.1

###

DELETE exampleUrl2 HTTP/1.1
`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '#    ',
            subType: 'normal',
            type: 'md'
          },
          {
            type: 'openApi3',
            method: 'GET',
            description: '',
            url: 'exampleUrl',
            summary: '',
            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {},
                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: ''
              }
            ]
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'GET', 'exampleUrl', 'endpoint'],
        title: 'GET exampleUrl',
        warning: []
      },

      {
        blocks: [
          {
            markdown: '#    ',
            subType: 'normal',
            type: 'md'
          },

          {
            type: 'openApi3',
            method: 'DELETE',
            summary: '',
            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {},
                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: ''
              }
            ],

            description: '',
            url: 'exampleUrl2'
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'DELETE', 'exampleUrl2', 'endpoint'],
        title: 'DELETE exampleUrl2',
        warning: []
      }
    ]);
  });

  it('should extract url with title, and headers and json', () => {
    const input = `
### title example
POST http://example-url-3.com.br HTTP/1.1
Content-Type: application/json
Authorization: Bearer example
{
  "any": {
      "json": "data",
  },
  "any2": {
      "json2": 123
  }
}
`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '# title example\n   ',
            subType: 'normal',
            type: 'md'
          },
          {
            type: 'openApi3',
            method: 'POST',

            url: 'http://example-url-3.com.br',
            summary: '',
            description: '',
            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {
                  'Content-Type': referenceApplicationJsonHeader,
                  Authorization: 'Bearer example'
                },

                payload: `{
  "any": {
      "json": "data",
  },
  "any2": {
      "json2": 123
  }
}`,
                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                }
              }
            ]
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'POST', 'http://example-url-3.com.br', 'endpoint'],
        title: 'title example',
        warning: []
      }
    ]);
  });

  it('should extract data with "Content-type"', () => {
    const input = `
### title example
POST http://example-url-2.com.br HTTP/1.1
Content-type: application/json
Authorization: Bearer example
{
  "any": "abc"
}
`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '# title example\n   ',
            subType: 'normal',
            type: 'md'
          },
          {
            type: 'openApi3',
            method: 'POST',
            url: 'http://example-url-2.com.br',
            description: '',
            summary: '',

            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {
                  'Content-type': referenceApplicationJsonHeader,
                  Authorization: 'Bearer example'
                },
                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: '{\n  "any": "abc"\n}' // conveter para objeto
              }
            ]
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'POST', 'http://example-url-2.com.br', 'endpoint'],
        title: 'title example',
        warning: []
      }
    ]);
  });

  it('should extract url with title, and headers and NOT json because do not content type json', () => {
    const input = `
### Faz isso e aquilo
POST http://localhost:3333/example-url2 HTTP/1.1
Authorization: Bearer Example
{
  invalid content
}
`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '# Faz isso e aquilo\n   ',
            subType: 'normal',
            type: 'md'
          },
          {
            type: 'openApi3',
            method: 'POST',
            url: 'http://localhost:3333/example-url2',
            summary: '',
            description: '',

            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {
                  Authorization: 'Bearer Example',
                  'content-type': 'application/json'
                },
                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: '{\n  invalid content\n}'
              }
            ]
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'POST', 'http://localhost:3333/example-url2', 'endpoint'],
        title: 'Faz isso e aquilo',
        warning: [
          {
            file: './docs/adr/file.http',
            type: 'request-json-without-header',
            code: [
              '### Faz isso e aquilo\nPOST http://localhost:3333/example-url2 HTTP/1.1\nAuthorization: Bearer Example\n{\n  invalid content\n}\n'
            ]
          }
        ]
      }
    ]);
  });

  it('should extract complete url with multiples comments and complete request', () => {
    const input = `
### example title 2
# comment1
// comment2
PATCH http://localhost:3333/example-url HTTP/1.1
Content-Type: application/json
Authorization: Bearer 1234567
// comment3
{
  "any": {
      "json": "data",
  },
  "any2": {
      "json2": 123
  }
}
`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '# example title 2\ncomment1   \ncomment2   \ncomment3   \n   ',
            subType: 'normal',
            type: 'md'
          },
          {
            method: 'PATCH',
            description: '',
            summary: '',

            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {
                  'Content-Type': referenceApplicationJsonHeader,
                  Authorization: 'Bearer 1234567'
                },

                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: `{
  "any": {
      "json": "data",
  },
  "any2": {
      "json2": 123
  }
}`
              }
            ],

            type: 'openApi3',
            url: 'http://localhost:3333/example-url'
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'PATCH', 'http://localhost:3333/example-url', 'endpoint'],
        title: 'example title 2',
        warning: []
      }
    ]);
  });

  it('should resolve base url on use variable sintax', () => {
    const input = `
### example title 2
@baseUrl = http://localhost:3333
PATCH {{baseUrl}}/example-url-3 HTTP/1.1
Content-Type: application/json
Authorization: Bearer 1234567

####

GET {{baseUrl}}/url-test


`;

    expect(handlerCollectHttp(input, configFile, fileInput, fileTags)).toEqual([
      {
        blocks: [
          {
            markdown: '# example title 2\n   ',
            subType: 'normal',
            type: 'md'
          },
          {
            method: 'PATCH',

            type: 'openApi3',
            url: 'http://localhost:3333/example-url-3',
            description: '',
            summary: '',

            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {
                  'Content-Type': referenceApplicationJsonHeader,
                  Authorization: 'Bearer 1234567'
                },

                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: ``
              }
            ]
          }
        ],
        errors: [],
        handlerName: handlerNameCollectHttp,
        originName: configFile.name,
        tags: ['docs', 'adr', 'file', 'http', 'PATCH', 'http://localhost:3333/example-url-3', 'endpoint'],
        title: 'example title 2',
        warning: []
      },

      {
        blocks: [
          {
            markdown: '#    ',
            subType: 'normal',
            type: 'md'
          },

          {
            method: 'GET',
            type: 'openApi3',
            summary: '',
            description: '',

            sceneries: [
              {
                summary: '',
                description: '',
                params: {},
                headers: {},

                response: {
                  example: 'Sem exemplos de resposta',
                  status: 0
                },
                payload: ``
              }
            ],

            url: 'http://localhost:3333/url-test'
          }
        ],
        errors: [],
        handlerName: 'collect-http',
        originName: 'name',
        tags: ['docs', 'adr', 'file', 'http', 'GET', 'http://localhost:3333/url-test', 'endpoint'],
        title: 'GET http://localhost:3333/url-test',
        warning: []
      }
    ]);
  });
});
