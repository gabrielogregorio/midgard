import { swaggerParser } from './swaggerParser';

describe('', () => {
  it('', () => {
    const mainInput = `
    paths:
    /users/{userId}:
      get:
        summary: Returns a user by ID.
        parameters:
          - in: path
            name: userId
            required: true
            type: integer
            minimum: 1
            description: The ID of the user to return.
        responses:
          200:
            description: A User object.
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 4
                name:
                  type: string
                  example: Arthur Dent
          400:
            description: The specified user ID is invalid (e.g. not a number).
          404:
            description: A user with the specified ID was not found.
          default:
            description: Unexpected error
`;

    const data = swaggerParser(mainInput);
    expect(data).toStrictEqual({
      error: '',
      yaml: {
        '/users/{userId}': {
          get: {
            parameters: [
              { description: 'The ID of the user to return.', in: 'path', minimum: 1, name: 'userId', required: true, type: 'integer' }
            ],
            responses: {
              '200': {
                description: 'A User object.',
                schema: {
                  properties: { id: { example: 4, type: 'integer' }, name: { example: 'Arthur Dent', type: 'string' } },
                  type: 'object'
                }
              },
              '400': { description: 'The specified user ID is invalid (e.g. not a number).' },
              '404': { description: 'A user with the specified ID was not found.' },
              default: { description: 'Unexpected error' }
            },
            summary: 'Returns a user by ID.'
          }
        },
        paths: null
      }
    });
  });

  it('', () => {
    const mainInput = `
    /**
     * @swagger
     * /get/schemas/:
     *  post:
     *    tags: [TagExample]
     *    description: example comment
     *    requestBody:
     *      x-name: body
     *    responses:
     *      200:
     *        description: Ok
     *        content:
     *          application/json:
     *            schema:
     *                type: object
     */
`;

    const data = swaggerParser(mainInput);
    expect(data).toStrictEqual({
      error: '',
      yaml: {
        '/get/schemas/': {
          post: {
            description: 'example comment',
            requestBody: {
              'x-name': 'body'
            },
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Ok'
              }
            },
            tags: ['TagExample']
          }
        }
      }
    });
  });

  it('', () => {
    const mainInput = `
    /**
     * @swagger
     ** inbvalid
     */
`;

    const data = swaggerParser(mainInput);
    expect(data).toStrictEqual({
      error: expect.stringMatching('Erro ao realizar parser do swagger'),
      yaml: null
    });
  });
});
