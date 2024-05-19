import { extractTitle } from './extractTitle';

const line = `

# example
`;

const lineWithTopContent = `
example another content

# example
`;

describe('extractTitle', () => {
  it('should extract title', () => {
    const results = extractTitle(line);

    expect(results).toEqual({ title: 'example' });
  });

  it('should extract title with top content', () => {
    const results = extractTitle(lineWithTopContent);

    expect(results).toEqual({ title: 'example' });
  });

  it('should empty on no found title', () => {
    const results = extractTitle('any string example # example 2');

    expect(results).toEqual({ title: 'any string example # example 2' });
  });

  it('should get second title', () => {
    const results = extractTitle('example\n## title2');

    expect(results).toEqual({ title: 'title2' });
  });

  it('should get first util title', () => {
    const results = extractTitle('\n//\n+\n  \n----\n===\ntitulo util\n@#');

    expect(results).toEqual({ title: 'titulo util' });
  });
});
