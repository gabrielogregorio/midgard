import { extractCommentDocs } from './extractCommentDocs';

const extractDocRequest = /\/\*\s{0,10}(doc)[\s\n]*([\s\S]*?)[\n\s]*\*\//g;

describe('extractCommentDocs', () => {
  it('should extract docs strings and get type doc', () => {
    const line = `

any content //// abc example

/* doc
item1
*/

/* doc item2 */

/* doc
item3\nitem4
*/
`;

    const results = extractCommentDocs(line);

    expect(results[0]).toEqual({ type: 'doc', content: `item1` });
    expect(results[1]).toEqual({ type: 'doc', content: `item2` });
    expect(results[2]).toEqual({ type: 'doc', content: `item3\nitem4` });
  });

  it('should extract docs strings with spaces', () => {
    const line = `

any content //// abc example

/* doc
item1

center

item2
*/

`;

    const results = extractCommentDocs(line);

    expect(results[0]).toEqual({ type: 'doc', content: `item1\n\ncenter\n\nitem2` });
  });

  it('should extract docs strings and remove spaces', () => {
    const line = `

any content //// abc example

/* doc
  item1  
*/
`;

    const results = extractCommentDocs(line);

    expect(results[0]).toEqual({ type: 'doc', content: `item1` });
  });

  it('should returns empty or inputs is empty', () => {
    const results = [...''.matchAll(extractDocRequest)];

    expect(results).toEqual([]);
  });

  it('shoulds returns empty or not found doc comments', () => {
    const exampleOherCommentsTypes = `

    any content //// abc example
    
    /* other
    item1
    */
    `;
    const results = [...exampleOherCommentsTypes.matchAll(extractDocRequest)];

    expect(results).toEqual([]);
  });
});
