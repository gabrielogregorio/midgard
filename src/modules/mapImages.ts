import path from 'path';
import { generateId } from '../utils/generateId';

const regex = /!\[(.*)?\]\((.*)\)/gm;

const getPath = () => `http://localhost:${process.env.PORT}`;

const resolveImages = (search: RegExpExecArray, pathFile: string) => {
  const fullReference = search[0];
  const descriptionReference = search[1];
  const urlReference = search[2];

  const copyFrom = path.join(pathFile, urlReference);
  const extension = urlReference.split('.').reverse()[0];

  const newRandomFile = `${generateId()}.${extension}`;
  const copyTo = `./public/${newRandomFile}`;

  const urlFile = `${getPath()}/${newRandomFile}`;
  const replaceTo = `![${descriptionReference}](${urlFile})`;

  return { search: fullReference, replaceTo, copyFrom, copyTo };
};

export const mapImages = ({ content, pathFile }: { content: string; pathFile: string }) => {
  const allImages = [...new Set([...content.matchAll(regex)])];
  const resolved: {
    search: string;
    replaceTo: string;
    copyFrom: string;
    copyTo: string;
  }[] = [];

  allImages.forEach((search) => {
    if (search[2].startsWith('./')) {
      resolved.push(resolveImages(search, pathFile));
    }

    if (search[2].startsWith('/')) {
      resolved.push(resolveImages(search, ''));
    }
  });

  return resolved;
};
