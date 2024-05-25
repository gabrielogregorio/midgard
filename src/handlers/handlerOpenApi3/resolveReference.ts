/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAPI3 } from 'openapi-typescript';
import { CustomErrorReferenceNotFound } from './errors';
import { CustomSchemaObject } from '../../types';

export const resolveReference = (reference: string, schema: OpenAPI3): CustomSchemaObject => {
  const keys = (reference || '')
    .replace(/^#/, '')
    .split('/')
    .filter((item) => item.trim());

  let modelReference: any = schema;

  keys.forEach((key) => {
    modelReference = modelReference?.[key];
  });

  if (!modelReference) {
    throw new CustomErrorReferenceNotFound(reference);
  }

  return modelReference as CustomSchemaObject;
};
