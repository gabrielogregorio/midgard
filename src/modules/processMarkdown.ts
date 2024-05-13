import path from 'path';
import { SchemaType } from '../types';
import { extracTags } from './extractTags';
import { extractTitleDocs } from './extractTitle';
import { configFile } from './readConfigFile';
import fs from 'fs';
import { generateId } from '../utils/generateId';
import { extractDevBlocks } from './extractDevBlocks';

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

  const devAndNormalBlocks = extractDevBlocks(content);

  const title = extractTitleDocs(content || '');
  const extraTags = extracTags(devAndNormalBlocks || '');
  return {
    title: title.title,
    originName: config.name,
    handlerName: NAME,
    errors,
    tags: [...pathTags, ...extraTags.tags],
    content: extraTags.content
  };
};
