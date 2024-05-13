const extractDocRequest = /^\s*#{1,6}\s{1,}(.*)/gm;

type extractCommentDocsReturnType = {
  title: string;
};

export const extractTitleDocs = (content: string): extractCommentDocsReturnType => {
  const results = [...content.matchAll(extractDocRequest)];

  if (!results.length) {
    return {
      title: ''
    };
  }

  return {
    title: results[0][1]
  };
};
