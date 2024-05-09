import yaml from 'js-yaml';

interface Result<T> {
  yaml: T | null;
  error: string;
}

export const yamlParser = <T = any>(yamlString: string): Result<T> => {
  try {
    const result = yaml.load(yamlString);

    return { yaml: result as T, error: '' };
  } catch (error) {
    if (error instanceof Error) {
      return { yaml: null, error: `Erro ao realizar parser "${error.name}", message "${error.message}"` };
    }
    return { yaml: null, error: `Erro a o realizar parser "${error}"` };
  }
};
