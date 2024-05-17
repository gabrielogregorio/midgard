import { getMethodAndUrl } from './getMethodAndUrl';
import { referenceApplicationJsonHeader } from './utils';

const regexGetHeaders = /^([\w\-_]{1,})\s*:\s*(.{1,})$/;

export const processDocBlock = (textBlock: string) => {
  let method = '';
  let url = '';
  let startSavePayload = false;
  let payload = '';
  let title = '';
  let comments = '';

  const headers: { [key: string]: string } = {};
  const errors: string[] = [];

  textBlock.split('\n').forEach((line) => {
    const isComment = line.startsWith('# ') || line.startsWith('## ') || line.startsWith('// ');
    if (isComment) {
      comments += `${line
        .replace(/^## /, '')
        .replace(/^# /, '')
        .replace(/^\/\/ /, '')}\n`;
      return;
    }

    const startingPayload = line[0] === '{' && headers['Content-Type']?.includes(referenceApplicationJsonHeader);
    if (startingPayload) {
      startSavePayload = true;
    }

    if (startSavePayload) {
      if (line) {
        payload += `${line}\n`;
      }
      return;
    }

    const matchHeader = line.match(regexGetHeaders);
    if (url && method && matchHeader) {
      const [, key, value] = matchHeader;
      headers[key] = value;
      return;
    }

    const matchMethodAndUrl = getMethodAndUrl(line);
    if (matchMethodAndUrl) {
      url = matchMethodAndUrl.url;
      method = matchMethodAndUrl.method;
      return;
    }

    const isTitleBlock = line.trimStart().startsWith('###');
    if (isTitleBlock) {
      title = line.replace(/^###\s*/g, '');
      return;
    }

    if (line.trim()) {
      errors.push(`Unmapped characters found: "${line}"`);
    }
  });

  return {
    title,
    comments,
    errors,
    request: {
      method,
      headers,
      payload,
      url
    }
  };
};
