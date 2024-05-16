const extractDocRequest = /^\s*#{1,6}\s{1,}(.*)/gm;

type extractCommentDocsReturnType = {
  title: string;
};

export const extractTitleDocs = (content: string): extractCommentDocsReturnType => {
  const matchTitle = [...content.matchAll(extractDocRequest)];

  if (!matchTitle.length) {
    return {
      title: ''
    };
  }

  return {
    title: matchTitle[0][1]
  };
};
