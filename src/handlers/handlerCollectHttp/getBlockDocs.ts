const regexGetAllBlocks = /([#]{3,}\s.*(?:\n(?![#]{3,}).*)*)/gm;

export const getBlockDocs = (fileText: string): string[] => {
  const blocks = [...fileText.matchAll(regexGetAllBlocks)];
  if (!blocks.length) {
    return [fileText];
  }

  return blocks.map((block) => block[0]);
};
