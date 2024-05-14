import fs from 'fs';
import { SchemaType, codeWithoutLanguageType } from '../types';
import { extractTags } from './extractTags';
import { extractTitleDocs } from './extractTitle';
import { configFile } from './readConfigFile';
import { extractDevBlocks } from './extractDevBlocks';
import { mapLinkLocalReference } from './mapLinkLocalReference';
import { detectCodeWithoutLanguage } from './detectCodeWithoutLanguage';
import { mapImages } from './mapImages';

const NAME = 'process-markdown';

export const processMarkdown = (contentOriginal: string, config: configFile, pathINewImage: string): SchemaType => {
  let content = contentOriginal;
  const errors: string[] = [];
  const pathFile = pathINewImage.split('/').reverse().slice(1).reverse().join('/');

  const result = mapImages({
    content,
    pathFile
  });

  const pathTags = [
    ...new Set(
      pathINewImage
        .replaceAll('.', ' ')
        .replaceAll('/', ' ')
        .split(' ')
        .filter((item) => item.trim())
    )
  ];

  result.forEach((item) => {
    content = content.replaceAll(item.search, item.replaceTo);
    try {
      fs.copyFileSync(item.copyFrom, item.copyTo);
    } catch (error) {
      errors.push(`erro ao copiar ${item.copyFrom} para ${item.copyTo}`);
    }
  });

  const resultLinkLocal = mapLinkLocalReference({
    config,
    content
  });

  resultLinkLocal.forEach((item) => {
    content = content.replaceAll(item.search, item.replaceTo);
  });

  const devAndNormalBlocks = extractDevBlocks(content);

  const title = extractTitleDocs(content || '');
  const extraTags = extractTags(devAndNormalBlocks || '');

  const warning: codeWithoutLanguageType[] = [];
  extraTags.content.forEach((item) => {
    const resultLocal = detectCodeWithoutLanguage(item.markdown || '');
    if (resultLocal.length) {
      warning.push({
        code: resultLocal.map((line) => line.code),
        file: pathINewImage,
        type: 'code-without-language'
      });
    }
  });
  return {
    title: title.title,
    originName: config.name,
    warning,
    handlerName: NAME,
    errors,
    tags: [...pathTags, ...extraTags.tags],
    content: extraTags.content
  };
};
