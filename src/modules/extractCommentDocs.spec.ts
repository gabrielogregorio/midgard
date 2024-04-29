import { extractCommentDocs } from './extractCommentDocs';

const line = `

any content //// abc example

/* doc-request
first
*/

/* doc-request-example-2  second  */

  /* doc
  last
  */
`;

const extractDocRequest = /\/\*\s{0,10}(doc[\-\w\d]*)([\s\S]*?)\*\//g;

describe('extractCommentDocs', () => {
  it('should extract docs strings and get type doc', () => {
    const results = extractCommentDocs(line);

    expect(results[0]).toEqual({ type: 'doc-request', content: `\nfirst\n` });
    expect(results[1]).toEqual({ type: 'doc-request-example-2', content: `  second  ` });
    expect(results[2]).toEqual({ type: 'doc', content: `\n  last\n  ` });
  });

  it('should returns empty or inputs is empty', () => {
    const results = [...''.matchAll(extractDocRequest)];

    expect(results).toEqual([]);
  });

  it('shoulds returns empty or not found doc comments', () => {
    const exampleOherCommentsTypes = `

    any content //// abc example
    
    /* other
    first
    */
    `;
    const results = [...exampleOherCommentsTypes.matchAll(extractDocRequest)];

    expect(results).toEqual([]);
  });
});
