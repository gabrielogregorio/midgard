import { getBlockDocs } from './getBlockDocs';
import { processDocBlock } from './processDocBlock';

export const handlerCollectHttp = (file: string) => {
  const docs: ReturnType<typeof processDocBlock>[] = [];

  const blocks = getBlockDocs(file);
  blocks.forEach((block) => {
    docs.push(processDocBlock(block));
  });

  return docs;
};
