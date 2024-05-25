/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { OpenAPI3, ReferenceObject } from 'openapi-typescript';
import { CustomErrorReferenceNotFound } from './errors';
import { resolveReference } from './resolveReference';
import { CustomSchemaObject } from '../../types';

const generateObjectFromSchema = (localSchema: CustomSchemaObject, schema: OpenAPI3): any => {
  if (localSchema.example !== undefined) {
    return localSchema.example;
  }

  const schemaType = localSchema.type;
  if (schemaType === 'object' || schemaType === undefined || schemaType === null) {
    const propertiesSchema = localSchema.properties;
    if (!propertiesSchema) {
      throw new Error(`Is object but not has "properties" key and not example key, has "${JSON.stringify(localSchema)}" key`);
    }

    const result: any = {};
    Object.keys(propertiesSchema).forEach((key) => {
      const property = propertiesSchema[key];
      // @ts-ignore
      result[key] = openApi3ToJson(property, schema).data;
    });

    return result;
  }

  if (schemaType === 'array' && 'items' in localSchema) {
    return [openApi3ToJson(localSchema.items as CustomSchemaObject, schema).data];
  }

  if ('type' in localSchema) {
    return localSchema.type;
  }

  throw new Error(`Unsupported schema format: "${JSON.stringify(localSchema)}"`);
};

export const openApi3ToJson = (
  localSchema: CustomSchemaObject | ReferenceObject,
  fullSchema: OpenAPI3
): { errors: string[]; data: any } => {
  if (localSchema && '$ref' in localSchema && localSchema.$ref) {
    try {
      const resolvedSchema = resolveReference(localSchema.$ref, fullSchema);
      return { errors: [], data: generateObjectFromSchema(resolvedSchema, fullSchema) };
    } catch (error: unknown) {
      if (error instanceof CustomErrorReferenceNotFound) {
        return { errors: [`Reference not found to "${error.reference}"`], data: null };
      }

      return { errors: [`Error on get reference "${error}"`], data: null };
    }
  }

  return { errors: [], data: generateObjectFromSchema(localSchema as CustomSchemaObject, fullSchema) };
};
