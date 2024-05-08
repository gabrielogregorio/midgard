const extractDocRequest = /^\s*tags\s*:\s*(.*)\]/gm;

export const extracTags = (content: string): string[] => {
  const results = [...content.matchAll(extractDocRequest)];

  if (!results.length) {
    return [];
  }

  return results[0][1]
    .replaceAll('[', '')
    .split(',')
    .map((item) => item.trim());
};
