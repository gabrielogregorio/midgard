const extractDocRequest = /^\s*#{1,6}\s{1,}(.{1,})\s*/gm;

type extractCommentDocsReturnType = {
  title: string;
};

const getFirstUtilText = (content: string) => content.split('\n').find((line) => line.replace(/[^\w]/g, ''));

export const extractTitle = (content: string): extractCommentDocsReturnType => {
  const matchTitle = [...content.matchAll(extractDocRequest)];

  if (!matchTitle.length) {
    return {
      title: getFirstUtilText(content) || 'Sem título'
    };
  }

  const title = matchTitle[0][1]?.trim();
  return {
    title
  };
};
