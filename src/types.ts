// ref.any.abc
// [open link example](ref.docbytest.ui)
// não é preciso seguir a exata ordem e nem informar todo o fluxo de referencias
// alertas serão gerados em caso de colisões de merge de schemas
// names devem ser unicos no seu contexto
// deve dar para testar localmente integrações

export type Context = {
  file: string;
};

type pageDocsMd = {
  name?: string;
  title?: string;
  markdown?: string;
};

type pageDocsTestsEndpoints = {
  name?: string;
  description?: string;
  path?: string;
  method?: string;
  payload?: string;
  headers?: string;
  resposta?: string;
};

export type PageType = pageDocsMd | pageDocsTestsEndpoints;

export type SchemaType = {
  title?: string;
  name?: string;
  children?: SchemaType[];
  page?: PageType[];
};
