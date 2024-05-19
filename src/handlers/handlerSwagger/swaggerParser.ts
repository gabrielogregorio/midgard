import yaml from 'js-yaml';

interface ISwaggerParserReturn<T> {
  yaml: T | null;
  error: string;
}

export const swaggerParser = <T = unknown>(swaggerString: string): ISwaggerParserReturn<T> => {
  try {
    const swaggerWithoutTrashCharacters = swaggerString.split('\n').map((line) =>
      line
        .replace('@swagger', '')
        .replaceAll('*/', '')
        .replaceAll('/**', '')
        .replace(/^\s*\*/g, '')
    );

    const stringSwaggerAsYaml = swaggerWithoutTrashCharacters.join('\n');
    const result = yaml.load(stringSwaggerAsYaml);

    return { yaml: result as T, error: '' };
  } catch (error) {
    if (error instanceof Error) {
      return { yaml: null, error: `Erro ao realizar parser do swagger "${error.name}", message "${error.message}"` };
    }
    return { yaml: null, error: `Erro a o realizar parser do swagger "${error}"` };
  }
};
