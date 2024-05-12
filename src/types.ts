export type Context = {
  file: string;
};

type pageDocsMd = {
  type: 'md' | 'tag';
  subType: 'dev' | 'normal';
  markdown?: string;
};

export type contentType = pageDocsMd;

export type SchemaType = {
  title: string;
  errors?: string[];
  tags?: string[];
  content: contentType[];
  originName: string;
  handlerName: string;
};
