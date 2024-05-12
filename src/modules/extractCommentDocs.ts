const extractDocRequest = /\/\*\s{0,10}(doc)[\n\s]*([\s\S]*?)[\n\s]*\*\//g;

type extractCommentDocsReturnType = {
  content: string;
  type: string;
};

export const extractCommentDocs = (content: string): extractCommentDocsReturnType[] => {
  const results = [...content.matchAll(extractDocRequest)];

  if (!results.length) {
    return [];
  }

  return results.map((value) => {
    const contentBase = value[2]?.split('\n');

    const content = contentBase.map((line) => line.trim()).join('\n');

    return {
      type: value[1],
      content: content
    };
  });
};
