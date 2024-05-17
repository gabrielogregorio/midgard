import { handlerCollectHttp } from '.';
import { referenceApplicationJsonHeader } from './utils';

describe('', () => {
  it('should extract simple get request', () => {
    const examplePost = `
GET exampleUrl HTTP/1.1
`;

    expect(handlerCollectHttp(examplePost)).toEqual([
      {
        title: '',
        comments: '',
        errors: [],
        request: {
          method: 'GET',
          url: 'exampleUrl',
          headers: {},
          payload: ''
        }
      }
    ]);
  });

  it('should extract multiples request with empty title ', () => {
    const examplePost = `
###
GET exampleUrl HTTP/1.1

###

DELETE exampleUrl2 HTTP/1.1
`;

    expect(handlerCollectHttp(examplePost)).toEqual([
      {
        title: '',
        comments: '',
        errors: [],
        request: {
          method: 'GET',
          url: 'exampleUrl',
          headers: {},
          payload: ''
        }
      },
      {
        title: '',
        errors: [],
        comments: '',
        request: {
          method: 'DELETE',
          url: 'exampleUrl2',
          headers: {},
          payload: ''
        }
      }
    ]);
  });

  it('should extract url with title, and headers and json', () => {
    const examplePost = `
### title example
POST http://example-url-2.com.br HTTP/1.1
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

    expect(handlerCollectHttp(examplePost)).toEqual([
      {
        title: 'title example',
        comments: '',
        errors: [],
        request: {
          method: 'POST',
          url: 'http://example-url-2.com.br',
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
}
`
        }
      }
    ]);
  });

  it('should extract url with title, and headers and NOT json because do not content type json', () => {
    const examplePost = `
### Faz isso e aquilo
POST http://localhost:3333/example-url HTTP/1.1
Authorization: Bearer 1234567
{
  invalid content
}
`;

    expect(handlerCollectHttp(examplePost)).toEqual([
      {
        title: 'Faz isso e aquilo',
        comments: '',
        errors: ['Unmapped characters found: "{"', 'Unmapped characters found: "  invalid content"', 'Unmapped characters found: "}"'],
        request: {
          method: 'POST',
          url: 'http://localhost:3333/example-url',
          headers: {
            Authorization: 'Bearer 1234567'
          },
          payload: ``
        }
      }
    ]);
  });

  it('should extract complete url with multiples comments and complete request', () => {
    const examplePost = `
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

    expect(handlerCollectHttp(examplePost)).toEqual([
      {
        title: 'example title 2',
        comments: 'comment1\ncomment2\ncomment3\n',
        errors: [],
        request: {
          method: 'PATCH',
          url: 'http://localhost:3333/example-url',
          headers: {
            'Content-Type': referenceApplicationJsonHeader,
            Authorization: 'Bearer 1234567'
          },
          payload: `{
  "any": {
      "json": "data",
  },
  "any2": {
      "json2": 123
  }
}
`
        }
      }
    ]);
  });
});
