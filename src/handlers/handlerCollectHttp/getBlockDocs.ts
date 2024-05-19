export const getBlockDocs = (fileText: string): string[] => {
  const lines = fileText.split('\n');
  const blocks: string[] = [];

  let textCurrentBlock = '';
  lines.forEach((line) => {
    const isNewBlockAndHasSaveBlock = line.trim().startsWith('###') && textCurrentBlock;
    if (isNewBlockAndHasSaveBlock) {
      blocks.push(textCurrentBlock);
      textCurrentBlock = '';
    }

    textCurrentBlock = textCurrentBlock ? `${textCurrentBlock}\n${line}` : line;
  });

  const finishAnalysisButExitsSaveBlock = textCurrentBlock;
  if (finishAnalysisButExitsSaveBlock) {
    blocks.push(textCurrentBlock);
    textCurrentBlock = '';
  }

  return blocks;
};
