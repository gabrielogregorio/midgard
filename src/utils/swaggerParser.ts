import yaml from 'js-yaml';

interface Result<T> {
  yaml: T | null;
  error: string;
}

export const swaggerParser = <T = any>(swaggerString: string): Result<T> => {
  try {
    const swaggerWithoutTrash = swaggerString.split('\n').map((item) => {
      return item
        .replace('@swagger', '')
        .replaceAll('*/', '')
        .replaceAll('/**', '')
        .replace(/^\s*\*/g, ''); //precisa ser o ultimo
    });

    const stringSwaggerFormated = swaggerWithoutTrash.join('\n');
    const result = yaml.load(stringSwaggerFormated);

    return { yaml: result as T, error: '' };
  } catch (error) {
    if (error instanceof Error) {
      return { yaml: null, error: `Erro ao realizar parser do swagger "${error.name}", message "${error.message}"` };
    }
    return { yaml: null, error: `Erro a o realizar parser do swagger "${error}"` };
  }
};
