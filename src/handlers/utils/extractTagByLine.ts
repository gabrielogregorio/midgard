const extractDocRequest = /^[\s*]*tags\s*:\s*\[*(.*)\]/;

export const extractTagByLine = (line: string): string[] => {
  const matchTags = line.match(extractDocRequest);

  if (!matchTags) {
    return [];
  }

  return matchTags[1]
    .split(',')
    .filter((item) => item.trim())
    .map((item) => item.trim());
};
