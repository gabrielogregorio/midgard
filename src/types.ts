import { ObjectSubtype, SchemaObject } from 'openapi-typescript';

export type Context = {
  file: string;
};

type pageDocsMd = {
  type: 'md' | 'tag';
  subType: 'dev' | 'normal';
  markdown?: string;
};

export type swaggerRequestType = {
  type: 'openApi3';
  summary: string;
  description: string;
  method: string;
  url: string;
  sceneries: {
    summary: string;
    description: string;
    params: {
      [key: string]: {
        type: 'string';
        description: string;
        examples: string[];
      };
    };
    payload: unknown;
    headers: {
      [key: string]: string;
    };
    response: { status: number; example: unknown };
  }[];
};

export type blocksType = pageDocsMd | swaggerRequestType;

export type codeWithoutLanguageType = {
  type: 'code-without-language';
  file: string;
  message: string;
  code: string[];
};

export type requestJsonWithoutHeader = {
  type: 'request-json-without-header';
  file: string;
  message: string;
  code: string[];
};

type warningType = codeWithoutLanguageType | requestJsonWithoutHeader;

export type SchemaType = {
  title: string;
  errors?: string[];
  warning?: warningType[];
  tags?: string[];
  blocks: blocksType[];
  originName: string;
  handlerName: string;
};

export type CustomSchemaObject = SchemaObject & { type?: string; properties?: ObjectSubtype['properties'] };
