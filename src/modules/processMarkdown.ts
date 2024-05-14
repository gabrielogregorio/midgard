import path from 'path';
import { SchemaType, codeWithoutLanguageType } from '../types';
import { extracTags } from './extractTags';
import { extractTitleDocs } from './extractTitle';
import { configFile } from './readConfigFile';
import fs from 'fs';
import { generateId } from '../utils/generateId';
import { extractDevBlocks } from './extractDevBlocks';
import { mapLinkLocalReference } from './mapLinkLocalReference';
import { detectCodeWithoutLanguage } from './detectCodeWithoutLanguage';

const regex = /!\[(.*)?\]\((.*)\)/gm;

const getPath = () => {
  return `http://localhost:${process.env.PORT}`;
};

const mapImages = ({ content, pathMd }: { content: string; pathMd: string }) => {
  const allImages = [...new Set([...content.matchAll(regex)])].filter((item) => item[2].startsWith('./'));
  return allImages.map((search) => {
    const searchItem = search[0];
    const primeiraParte = search[1];
    const itemSearch = search[2];
    const copyFrom = path.join(pathMd, itemSearch);
    const extension = itemSearch.split('.').reverse()[0];

    const newFile = `${generateId()}.${extension}`;
    const copyTo = `./public/${newFile}`;
    const replaceTo = `![${primeiraParte}](${getPath() + '/' + newFile})`;

    return { search: searchItem, replaceTo, copyFrom, copyTo };
  });
};

const NAME = 'process-markdown';

export const processMarkdown = (contentOrigina: string, config: configFile, pathINewImage: string): SchemaType => {
  let content = contentOrigina;
  let errors: string[] = [];
  const pathMd = pathINewImage.split('/').reverse().slice(1).reverse().join('/');

  const result = mapImages({
    content,
    pathMd
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
  const extraTags = extracTags(devAndNormalBlocks || '');

  let warning: codeWithoutLanguageType[] = [];
  extraTags.content.forEach((item) => {
    const result = detectCodeWithoutLanguage(item.markdown || '');
    if (result.length) {
      warning.push({
        code: result.map((item) => item.code),
        file: pathINewImage,
        type: 'code-without-language'
      });
    }
  });
  return {
    title: title.title,
    originName: config.name,
    warning: warning,
    handlerName: NAME,
    errors,
    tags: [...pathTags, ...extraTags.tags],
    content: extraTags.content
  };
};
