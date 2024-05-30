import { processHandlerType } from '../../../modules/types';

const regex = /(?<!!)\[(.*)?\]\((.*)\)/gm;

const refFileTags = (itemSearch: string, config: processHandlerType) => {
  const tagsFile = itemSearch
    .replace(/[\\.\s\\/]{1,}/g, ' ')
    .split(' ')
    .filter((part) => part);

  return [...config.tags, ...tagsFile];
};

const resolveRelativeImage = (search: RegExpExecArray, config: processHandlerType) => {
  const searchItem = search[0];
  const itemSearch = search[2];

  const tags = refFileTags(itemSearch, config);
  const replaceTo = `[ref.${tags.join('.')}]`;

  return { search: searchItem, replaceTo };
};

type findLocalFileReferencesReturnType = { content: string; config: processHandlerType };

export const findLocalFileReferences = ({ content, config }: findLocalFileReferencesReturnType) => {
  const allReferences = [...new Set([...content.matchAll(regex)])];

  const resolved: {
    search: string;
    replaceTo: string;
  }[] = [];

  allReferences.forEach((search) => {
    const isLink = search[2].startsWith('http');
    if (isLink) {
      return;
    }

    resolved.push(resolveRelativeImage(search, config));
  });

  return resolved;
};
