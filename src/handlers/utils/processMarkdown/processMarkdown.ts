import fs from 'fs';
import { findImages } from './findImages';
import { findLocalFileReferences } from './findLocalFileReferences';
import { extractDevBlocks } from './extractDevBlocks';
import { extractTitle } from './extractTitle';
import { extractTagsByBlock } from './extractTagsByBlock';
import { codeWithoutLanguageType } from '../../../types';
import { detectCodeWithoutLanguage } from './detectCodeWithoutLanguage';
import { codeWithoutLanguage } from './utils';
import { processHandlerType } from '../../../modules/types';

export const processMarkdown = (contentOriginal: string, config: processHandlerType, file: string) => {
  let content = contentOriginal;

  const errors: string[] = [];
  const warning: codeWithoutLanguageType[] = [];

  const pathFile = file.split('/').reverse().slice(1).reverse().join('/');

  const images = findImages({
    content,
    pathFile
  });

  images.forEach((image) => {
    content = content.replaceAll(image.search, image.replaceTo);
    try {
      fs.copyFileSync(image.copyFrom, image.copyTo);
    } catch (error) {
      errors.push(`Error on copy image "${image.copyFrom}" to "${image.copyTo}"`);
    }
  });

  const localReferences = findLocalFileReferences({
    config,
    content
  });

  localReferences.forEach((reference) => {
    content = content.replaceAll(reference.search, reference.replaceTo);
  });

  const devBlocks = extractDevBlocks(content);
  const title = extractTitle(content || '');
  const tags = extractTagsByBlock(devBlocks || '');

  tags.blocks.forEach((block) => {
    if ('markdown' in block) {
      const resultLocal = detectCodeWithoutLanguage(block.markdown || '');
      if (resultLocal.length) {
        warning.push({
          code: resultLocal.map((line) => line.code),
          file,
          message: codeWithoutLanguage,
          type: 'code-without-language'
        });
      }
    }
  });
  return {
    title: title.title,
    warning,
    errors,
    tags: tags.tags,
    blocks: tags.blocks
  };
};
