import { OpenAPI3, ReferenceObject, SchemaObject } from 'openapi-typescript';
import { openApi3ToJson } from './openApiToJson';

const fullSchema: OpenAPI3 = {
  openapi: '3.0.1',
  info: {
    title: 'example',
    version: '3.8.0'
  },
  servers: [],
  paths: {},
  components: {
    schemas: {
      ExampleAccess: {
        type: 'object',
        properties: {
          case: {
            type: 'object',
            properties: {
              item1: {
                type: 'string',
                example: 'case 1'
              },
              item2: {
                type: 'string',
                example: 'case 2'
              }
            }
          }
        }
      },
      ExampleSecond: {
        required: [],
        type: 'object',
        properties: {
          item1: {
            type: 'string',
            example: 'example1'
          },
          item2: {
            type: 'string',
            example: 'example2'
          }
        }
      }
    }
  }
};

describe('openApi3ToJson', () => {
  it('should resolve a simple schema', () => {
    const example1: SchemaObject = {
      required: ['name', 'bestNumber'],
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'indiana'
        }
      }
    };

    const convertedSchema = openApi3ToJson(example1, fullSchema);
    expect(convertedSchema).toEqual({ errors: [], data: { name: 'indiana' } });
  });

  it('should resolve a two schema', () => {
    const example1: SchemaObject = {
      required: ['name', 'bestNumber'],
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'indiana'
        },
        otherValue: {
          type: 'boolean',
          example: false
        }
      }
    };

    const convertedSchema = openApi3ToJson(example1, fullSchema);
    expect(convertedSchema).toEqual({ errors: [], data: { name: 'indiana', otherValue: false } });
  });

  it('should resolve a objects schema', () => {
    const example1: SchemaObject = {
      required: ['name', 'bestNumber'],
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'indiana',
          description: 'Nome da pessoa'
        },
        otherValue: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'deu bom'
            },
            list: {
              type: 'array',
              example: ['item1', 'item2', 'item3']
            },
            number: {
              type: 'integer',
              example: 7
            },
            result: {
              type: 'boolean',
              example: false
            },
            inside: {
              type: 'object',
              properties: {
                key1: {
                  type: 'string',
                  example: 'value1'
                }
              }
            }
          }
        }
      }
    };

    const convertedSchema = openApi3ToJson(example1, fullSchema);
    expect(convertedSchema).toEqual({
      errors: [],
      data: {
        name: 'indiana',
        otherValue: {
          message: 'deu bom',
          list: ['item1', 'item2', 'item3'],
          number: 7,
          result: false,
          inside: { key1: 'value1' }
        }
      }
    });
  });

  it('should resolve a objects schema', () => {
    const example1: SchemaObject = {
      type: 'object',
      properties: {
        error: {
          properties: {
            code: {
              type: 'string',
              example: '387'
            },
            message: {
              type: 'string',
              example: 'any error'
            }
          }
        }
      }
    };

    const convertedSchema = openApi3ToJson(example1, fullSchema);
    expect(convertedSchema).toEqual({
      errors: [],
      data: {
        error: {
          code: '387',
          message: 'any error'
        }
      }
    });
  });

  it('should resolve a objects with ref', () => {
    const example1: SchemaObject | ReferenceObject = {
      $ref: '#/components/schemas/ExampleAccess'
    };

    const convertedSchema = openApi3ToJson(example1, fullSchema);
    expect(convertedSchema).toEqual({
      errors: [],
      data: {
        case: {
          item1: 'case 1',
          item2: 'case 2'
        }
      }
    });
  });

  it('should resolve internal ref objects with ref', () => {
    const example1: SchemaObject | ReferenceObject = {
      type: 'array',
      description: '',
      items: {
        $ref: '#/components/schemas/ExampleSecond'
      }
    };

    const convertedSchema = openApi3ToJson(example1, fullSchema);
    expect(convertedSchema).toEqual({
      errors: [],
      data: [
        {
          item1: 'example1',
          item2: 'example2'
        }
      ]
    });
  });
});

it('should resolve a objects schema without example', () => {
  const example1: SchemaObject = {
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    type: 'object'
  };

  const convertedSchema = openApi3ToJson(example1, fullSchema);
  expect(convertedSchema).toEqual({
    errors: [],
    data: {
      username: 'string',
      password: 'string'
    }
  });
});
