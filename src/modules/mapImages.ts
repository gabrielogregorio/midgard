import path from 'path';
import { generateId } from '../utils/generateId';

const regex = /!\[(.*)?\]\((.*)\)/gm;

const getPath = () => {
  return `http://localhost:${process.env.PORT}`;
};

const resolveRelativeImage = (search: RegExpExecArray, pathMd: string) => {
  const searchItem = search[0];
  const primeiraParte = search[1];
  const itemSearch = search[2];
  const copyFrom = path.join(pathMd, itemSearch);
  const extension = itemSearch.split('.').reverse()[0];

  const newFile = `${generateId()}.${extension}`;
  const copyTo = `./public/${newFile}`;
  const replaceTo = `![${primeiraParte}](${getPath() + '/' + newFile})`;

  return { search: searchItem, replaceTo, copyFrom, copyTo };
};

const resolveAbsoluteImages = (search: RegExpExecArray) => {
  const searchItem = search[0];
  const primeiraParte = search[1];
  const itemSearch = search[2];
  const copyFrom = path.join(itemSearch);
  const extension = itemSearch.split('.').reverse()[0];

  const newFile = `${generateId()}.${extension}`;
  const copyTo = `./public/${newFile}`;
  const replaceTo = `![${primeiraParte}](${getPath() + '/' + newFile})`;

  return { search: searchItem, replaceTo, copyFrom, copyTo };
};

export const mapImages = ({ content, pathMd }: { content: string; pathMd: string }) => {
  const allImages = [...new Set([...content.matchAll(regex)])];
  let resolved: {
    search: string;
    replaceTo: string;
    copyFrom: string;
    copyTo: string;
  }[] = [];

  allImages.forEach((search) => {
    if (search[2].startsWith('./')) {
      resolved.push(resolveRelativeImage(search, pathMd));
    }

    if (search[2].startsWith('/')) {
      resolved.push(resolveAbsoluteImages(search));
    }
  });

  return resolved;
};
