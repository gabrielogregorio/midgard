import { configFile } from './readConfigFile';

const regex = /(?<!\!)\[(.*)?\]\((.*)\)/gm;

const refFileTags = (itemSearch: string, config: configFile) => {
  const tagsFile = itemSearch
    .replace(/[\.\s\/]{1,}/g, ' ')
    .split(' ')
    .filter((item) => item);

  const defaultConfigfs = (config.context + '.' + config.name).split('.').filter((item) => item);

  return [...defaultConfigfs, ...tagsFile];
};

const resolveRelativeImage = (search: RegExpExecArray, config: configFile) => {
  const searchItem = search[0];
  const itemSearch = search[2];

  const tags = refFileTags(itemSearch, config);
  const replaceTo = `[ref.${tags.join('.')}]`;

  return { search: searchItem, replaceTo };
};

export const mapLinkLocalReference = ({ content, config }: { content: string; config: configFile }) => {
  const allImages = [...new Set([...content.matchAll(regex)])];
  let resolved: {
    search: string;
    replaceTo: string;
  }[] = [];

  allImages.forEach((search) => {
    const isNotLink = !search[2].startsWith('http');
    if (isNotLink) {
      resolved.push(resolveRelativeImage(search, config));
    }
  });

  return resolved;
};
