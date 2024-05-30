/* eslint-disable sonarjs/no-duplicate-string */
import { handlerSwagger } from '.';
import { processHandlerType } from '../../modules/types';

const fileInput = './docs/adr/file.md';

const mockContext: processHandlerType = { tags: ['example', 'tag', 'name'], bannedPaths: [], directory: '', title: '' };

const fileTags = ['name'];

describe('', () => {
  it('', () => {
    const mainInput = `
/**
 * @swagger
 * /example/otherExample:
 *  post:
 *    tags: [Autogeracação]
 *    summary: title example
 *    description: example-description
 *  */   
`;

    const resultEnd = handlerSwagger(mainInput, mockContext, fileInput, fileTags);

    expect(resultEnd).toEqual([
      {
        blocks: [
          {
            type: 'openApi3',
            description: 'example-description',
            url: '/example/otherExample',
            summary: 'title example',
            method: 'post',
            sceneries: [
              {
                headers: {},
                params: {},
                description: 'Sem exemplos de resposta',
                payload: '',
                summary: 'title example',
                response: {
                  example: '',
                  status: 0
                }
              }
            ]
          }
        ],
        originName: 'example.tag.name',
        handlerName: 'process-swagger',
        errors: [],
        tags: ['name', 'swagger', 'endpoint', 'post', '/example/otherExample', 'Autogeracação'],
        title: 'title example'
      }
    ]);
  });

  it('', () => {
    const mainInput = `
/**
 * @swagger
 * /example/otherExample:
 *  post:
 *    tags: [Autogeracação]
 *    summary: title example
 *    description: | 
 *      text1
 *      text2
 *  */   
`;

    const resultEnd = handlerSwagger(mainInput, mockContext, fileInput, fileTags);

    expect(resultEnd).toEqual([
      {
        blocks: [
          {
            type: 'openApi3',
            summary: 'title example',
            method: 'post',
            url: '/example/otherExample',
            description: 'text1\ntext2\n',

            sceneries: [
              {
                response: {
                  example: '',
                  status: 0
                },
                summary: 'title example',
                headers: {},
                params: {},
                description: 'Sem exemplos de resposta',
                payload: ''
              }
            ]
          }
        ],
        originName: 'example.tag.name',
        handlerName: 'process-swagger',
        errors: [],
        tags: ['name', 'swagger', 'endpoint', 'post', '/example/otherExample', 'Autogeracação'],
        title: 'title example'
      }
    ]);
  });

  it('', () => {
    const mainInput = `
    /**
     * @swagger
     * components:
     *  schemas:
     *    any example
    */
   `;

    const resultEnd = handlerSwagger(mainInput, mockContext, fileInput, fileTags);

    expect(resultEnd).toEqual([]);
  });

  it('should extract payload', () => {
    const mainInput = `
    /**
     * @swagger
     * /example/endpoint/:
     *  post:
     *    tags: [ExampleTag]
     *    description: example description
     *    requestBody:
     *      x-name: body
     *      content:
     *        application/json:
     *          schema:
     *            required:
     *              - message
     *            properties:
     *              message:
     *                type: string
     *                example: "example message"
     *    responses:
     *      200:
     *        description: All Ok
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                type: object
     *                properties:
     *                  id:
     *                    type: string
     *                  name:
     *                    type: string
     *            example: {
     *              "id": "4444444",
     *              "name": "exampleName"
     *            }
     *      404:
     *        description: Não encontrado
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                message:
     *                  type: string
     *            example: {
     *              "message": "NOT FOUND MESSAGE"
     *            }
     */
    

`;

    const resultEnd = handlerSwagger(mainInput, mockContext, fileInput, fileTags);

    expect(resultEnd).toEqual([
      {
        tags: ['name', 'swagger', 'endpoint', 'post', '/example/endpoint/', 'ExampleTag'],
        originName: 'example.tag.name',
        handlerName: 'process-swagger',
        blocks: [
          {
            type: 'openApi3',
            description: 'example description',
            method: 'post',
            url: '/example/endpoint/',
            sceneries: [
              {
                params: {},
                summary: '',
                response: {
                  status: 200,
                  example: {
                    id: '4444444',
                    name: 'exampleName'
                  }
                },
                description: 'All Ok',
                headers: {},
                payload: { message: 'example message' }
              },
              {
                headers: {},
                description: 'Não encontrado',
                params: {},
                payload: { message: 'example message' },
                response: { status: 404, example: { message: 'NOT FOUND MESSAGE' } },
                summary: ''
              }
            ],
            summary: ''
          }
        ],
        errors: [],
        title: 'example description'
      }
    ]);
  });

  it('should extract payload', () => {
    const mainInput = `
    /**
     * @swagger
     * /example/{param1}/example2/{param2}/example3/{param3}:
     *  get:
     *    tags: [exampleTag]
     *    description: description 1
     *    parameters:
     *    - in: path
     *      type: string
     *      name: param1
     *      required: true
     *      example: '11111111'
     *      description: param description v1
     *    - in: path
     *      name: param2
     *      type: string
     *      required: true
     *      description: param description v2
    *    - in: path
    *      name: param3
    *      type: string
    *      required: true
    *      description: param description v3
    *      example: '11111111'
    *      examples:
    *        example1: {value: '11111111'}
    *        example2: {value: '222222'}
    *    responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *             schema:
     *              $ref: '#/components/schemas/example3'
     */
    

`;

    const resultEnd = handlerSwagger(mainInput, mockContext, fileInput, fileTags);

    expect(resultEnd).toEqual([
      {
        tags: ['name', 'swagger', 'endpoint', 'get', '/example/{param1}/example2/{param2}/example3/{param3}', 'exampleTag'],
        originName: 'example.tag.name',
        handlerName: 'process-swagger',
        blocks: [
          {
            type: 'openApi3',
            description: 'description 1',
            method: 'get',
            url: '/example/{param1}/example2/{param2}/example3/{param3}',
            sceneries: [
              {
                headers: {},
                description: 'Sem exemplos de resposta',
                params: {
                  param1: {
                    description: 'param description v1',
                    examples: ['11111111']
                  },
                  param2: {
                    description: 'param description v2',
                    examples: []
                  },
                  param3: {
                    description: 'param description v3',
                    examples: ['11111111', '11111111', '222222']
                  }
                },

                payload: '',
                response: {
                  example: '',
                  status: 0
                },
                summary: ''
              }
            ],
            summary: ''
          }
        ],
        errors: [],
        title: 'description 1'
      }
    ]);
  });
});
