import { configFile } from './readConfigFile';

const regex = /(?<!!)\[(.*)?\]\((.*)\)/gm;

const refFileTags = (itemSearch: string, config: configFile) => {
  const tagsFile = itemSearch
    .replace(/[\\.\s\\/]{1,}/g, ' ')
    .split(' ')
    .filter((item) => item);

  const defaultConfigs = `${config.context}.${config.name}`.split('.').filter((item) => item);

  return [...defaultConfigs, ...tagsFile];
};

const resolveRelativeImage = (search: RegExpExecArray, config: configFile) => {
  const searchItem = search[0];
  const itemSearch = search[2];

  const tags = refFileTags(itemSearch, config);
  const replaceTo = `[ref.${tags.join('.')}]`;

  return { search: searchItem, replaceTo };
};

type mapLinkLocalReferenceReturnType = { content: string; config: configFile };

export const mapLinkLocalReference = ({ content, config }: mapLinkLocalReferenceReturnType) => {
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
