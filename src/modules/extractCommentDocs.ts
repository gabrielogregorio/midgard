const extractDocRequest = /\/\*\s{0,10}(doc[\-\w\d]*)([\s\S]*?)\*\//g;

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
    return {
      type: value[1],
      content: value[2]
    };
  });
};
