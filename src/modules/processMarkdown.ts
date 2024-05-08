import path from 'path';
import { SchemaType } from '../types';
import { extracTags } from './extractTags';
import { extractTitleDocs } from './extractTitle';
import { configFile } from './readConfigFile';
import fs from 'fs';

const regex = /!\[(.*)?\]\((.*)\)/gm;

const getPath = () => {
  return `http://localhost:${process.env.PORT}`;
};

const mapImages = ({ content, pathMd }: { content: string; pathMd: string }) => {
  const allImages = [...new Set([...content.matchAll(regex)])].filter((item) => item[1].startsWith('./'));
  return allImages.map((search) => {
    const searchItem = search[0];
    const primeiraParte = search[1];
    const itemSearch = search[2];
    const copyFrom = path.join(pathMd, itemSearch);
    const extension = itemSearch.split('.').reverse()[0];

    const newFile = `${Math.random()}.${extension}`;
    const copyTo = `./public/${newFile}`;
    const replaceTo = `![${primeiraParte}](${getPath() + '/' + newFile})`;

    console.log({ search: searchItem, replaceTo, copyFrom, copyTo });
    return { search: searchItem, replaceTo, copyFrom, copyTo };
  });
};

export const processMarkdown = (contentOrigina: string, config: configFile, pathINewImage: string): SchemaType => {
  let content = contentOrigina;
  let errors: string[] = [];
  const fullcontext = (config.context + '.' + config.name).split('.');
  const pathMd = pathINewImage.split('/').reverse().slice(1).reverse().join('/');

  const result = mapImages({
    content,

    pathMd
  });

  result.forEach((item) => {
    content = content.replaceAll(item.search, item.replaceTo);
    console.log(item.search, item.replaceTo, 'a');
    try {
      fs.copyFileSync(item.copyFrom, item.copyTo);
    } catch (error) {
      errors.push(`erro ao copiar ${item.copyFrom} para ${item.copyTo}`);
    }
  });

  const title = extractTitleDocs(content || '');
  const extraTags = extracTags(content || '');
  return {
    title: title.title,
    originName: config.name,
    errors,
    tags: [...fullcontext, ...extraTags],
    content: [{ markdown: content }]
  };
};
