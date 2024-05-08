import { extractTitleDocs } from './extractTitle';

const line = `

# example
`;


const lineWithTopContent = `
example another content

# example
`;

describe('extractTitleDocs', () => {
  it('should extract title', () => {
    const results = extractTitleDocs(line);

    expect(results).toEqual({ title: 'example' });
  });

  it('should extract title with top content', () => {
    const results = extractTitleDocs(lineWithTopContent);

    expect(results).toEqual({ title: 'example' });
  });

  it('should empty on no found title', () => {
    const results = extractTitleDocs('any string example # example 2');

    expect(results).toEqual({ title: '' });
  });
});
