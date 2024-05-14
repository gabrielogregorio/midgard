export type Context = {
  file: string;
};

type pageDocsMd = {
  type: 'md' | 'tag';
  subType: 'dev' | 'normal';
  markdown?: string;
};

export type contentType = pageDocsMd;

export type codeWithoutLanguageType = {
  type: 'code-without-language';
  file: string;
  code: string[];
};

type warningType = codeWithoutLanguageType;

export type SchemaType = {
  title: string;
  errors?: string[];
  warning?: warningType[];
  tags?: string[];
  content: contentType[];
  originName: string;
  handlerName: string;
};
