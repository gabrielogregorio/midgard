/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAPI3 } from 'openapi-typescript';
import { handlerOpenApi3 } from './index';
import { processHandlerType } from '../../modules/types';

const example1: OpenAPI3 = {
  openapi: '3.0.0',
  info: {
    title: 'title docs',
    description: 'example description docs',
    version: 'version'
  },
  servers: [
    {
      description: '',
      variables: {},
      url: 'https://example'
    }
  ],
  paths: {
    '/endpointExample': {
      post: {
        security: [
          {
            bearerAuth: []
          }
        ],
        summary: '',
        tags: ['tag1', 'tag2'],
        description: '',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                required: ['name', 'bestNumber'],
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'indiana',
                    description: 'Nome da pessoa'
                  },
                  bestNumber: {
                    type: 'number',
                    example: '123',
                    description: 'best number'
                  },
                  isEnabled: {
                    type: 'boolean',
                    example: 'true',
                    description: 'isEnabled'
                  }
                }
              }
            }
          },
          required: true
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      example: { data: 'ok' }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      properties: {
                        error: {
                          type: 'string',
                          example: 'any error, sorry'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/list': {
      get: {
        tags: ['tag1'],
        description: 'example description',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'string'
                      },
                      example: ['result example']
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      properties: {
                        code: {
                          type: 'string',
                          example: 'OPS'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const config: processHandlerType = { tags: ['example', 'tag', 'name'], bannedPaths: [], directory: '', title: '' };
const fileTags = ['docs', 'adr', 'file', 'http'];
const filePath = 'examplefile.json';

describe('handlerOpenApi3', () => {
  it('handlerOpenApi3', () => {
    const result = handlerOpenApi3(JSON.stringify(example1, undefined, 4), config, filePath, fileTags);

    expect(result).toEqual([
      {
        blocks: [
          {
            description: '# title docs\n\nexample description docs\n\nSwagger post /endpointExample',
            method: 'post',
            summary: '',
            sceneries: [
              {
                response: {
                  example: {
                    data: {
                      data: 'ok'
                    }
                  },
                  status: 201
                },
                summary: 'Created',
                description: '',
                headers: {},
                params: {},
                payload: { name: 'indiana', bestNumber: '123', isEnabled: 'true' }
              },

              {
                description: '',
                headers: {},
                params: {},
                payload: {
                  bestNumber: '123',
                  isEnabled: 'true',
                  name: 'indiana'
                },
                response: {
                  example: {
                    error: {
                      error: 'any error, sorry'
                    }
                  },
                  status: 400
                },
                summary: 'Bad Request'
              }
            ],

            type: 'openApi3',
            url: '/endpointExample'
          }
        ],
        errors: [],
        handlerName: 'open-api-3',
        originName: 'example.tag.name',
        tags: ['docs', 'adr', 'file', 'http', 'tag1', 'tag2'],
        title: 'title docs post /endpointExample',
        warning: []
      },
      {
        blocks: [
          {
            description: '# title docs\n\nexample description docs\n\nexample description',
            method: 'get',
            summary: '',
            type: 'openApi3',
            url: '/list',
            sceneries: [
              {
                description: '',
                headers: {},
                params: {},
                payload: '',
                summary: 'Success',
                response: {
                  example: {
                    data: ['result example']
                  },
                  status: 200
                }
              },
              {
                description: '',
                headers: {},
                params: {},
                payload: '',
                response: {
                  example: {
                    error: {
                      code: 'OPS'
                    }
                  },
                  status: 500
                },
                summary: 'Internal Error'
              }
            ]
          }
        ],
        errors: [],
        handlerName: 'open-api-3',
        originName: 'example.tag.name',
        tags: ['docs', 'adr', 'file', 'http', 'tag1'],
        title: 'title docs get /list',
        warning: []
      }
    ]);
  });
});
