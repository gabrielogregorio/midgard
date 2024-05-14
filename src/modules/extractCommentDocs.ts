const extractDocRequest = /\/\*\s{0,10}(doc)[\n\s]*([\s\S]*?)[\n\s]*\*\//g;

type extractCommentDocsReturnType = {
  content: string;
  type: string;
};

export const extractCommentDocs = (code: string): extractCommentDocsReturnType[] => {
  const comments = [...code.matchAll(extractDocRequest)];

  if (!comments.length) {
    return [];
  }

  return comments.map((commentMatch) => {
    const comment = commentMatch[2]?.split('\n');

    const content = comment.map((line) => line.trim()).join('\n');

    return {
      type: commentMatch[1],
      content
    };
  });
};
