/* eslint-disable max-lines */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
import { configFile } from '../../modules/readConfigFile';
import { blocksType, requestJsonWithoutHeader } from '../../types';
import { extractTagByLine } from '../utils/extractTagByLine';
import { processMarkdown } from '../utils/processMarkdown/processMarkdown';
import { getMethodAndUrl } from './getMethodAndUrl';
import { referenceApplicationJsonHeader } from './utils';

const regexGetHeaders = /^([\w\-_]{1,})\s*:\s*(.{1,})$/;

const regexGetVariables = /^@([\w]{1,})\s*=\s*(.*)$/g;

type processDocBlockResponseType = {
  title: string;
  tags: string[];
  errors: string[];
  blocks: blocksType[];
  warning: requestJsonWithoutHeader[];
  variables: { [key: string]: string };
};

export const processDocBlock = (
  textBlock: string,
  config: configFile,
  filePath: string,
  variablesLocal: { [key: string]: string }
): processDocBlockResponseType => {
  let method = '';
  let url = '';
  let startSavePayload = false;
  let payload = '';
  let title = '';
  let tags: string[] = [];
  let comments = '';
  const headers: { [key: string]: string } = {};
  const errors: string[] = [];
  const variables: { [key: string]: string } = variablesLocal;
  const warning: requestJsonWithoutHeader[] = [];

  const lines = textBlock.split('\n');

  const replaceVariableInLine = (lineLocal: string) => {
    let lineWithVariablesResolved = lineLocal;
    Object.keys(variables).forEach((key) => {
      lineWithVariablesResolved = lineWithVariablesResolved.replaceAll(new RegExp(`{\\s*{\\s*${key}\\s*}\\s*}`, 'g'), variables[key]);
    });

    return lineWithVariablesResolved;
  };

  lines.forEach((lineRaw) => {
    const isVariable = [...lineRaw.matchAll(regexGetVariables)];

    if (isVariable.length) {
      const [, variableKey, value] = isVariable[0];
      variables[variableKey] = value;
      return;
    }

    const line = replaceVariableInLine(lineRaw);

    const isComment = line.startsWith('# ') || line.startsWith('## ') || line.startsWith('// ');
    if (isComment) {
      const fullLine = line.replace(/^(#|##|\/\/) /, '');
      const tagsExtracted = extractTagByLine(fullLine);
      if (tags.length) {
        tags = tags.concat(tagsExtracted);
      }
      comments += `${fullLine}\n`;
      return;
    }

    const startingJson = line[0] === '{';

    const hasHeaderBlocksType = (headers['Content-Type'] || headers['content-type'] || headers['Content-type'])?.includes(
      referenceApplicationJsonHeader
    );
    if (startingJson) {
      if (!hasHeaderBlocksType) {
        warning.push({
          file: filePath,
          type: 'request-json-without-header',
          code: [textBlock]
        });
        headers['content-type'] = referenceApplicationJsonHeader;
      }
      startSavePayload = true;
    }

    if (startSavePayload) {
      if (line.trim()) {
        payload = payload ? `${payload}\n${line}` : line;
      }
      return;
    }

    const matchHeader = line.match(regexGetHeaders);
    if (matchHeader) {
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
      title = line.replace(/^[#]{3,}\s*/g, '');
      return;
    }

    if (line.trim()) {
      errors.push(`Foram encontrados carateres não identificados na análise do .http: "${line}", file "${filePath}"`);
    }
  });

  const titleContent = title.trim() ? `${title.trim()}\n` : '';
  const commentsContent = comments
    .split('\n')
    .map((comment) => `${comment}   `)
    .join('\n');
  const markdown = processMarkdown(`# ${titleContent}${commentsContent}`, config, filePath);

  const markdownTags = markdown.tags?.length ? markdown.tags : [];
  const markdownErrors = markdown.errors?.length ? markdown.errors : [];

  return {
    variables,
    title: title || markdown.title || `${method} ${url}`,
    warning,
    errors: [...errors, ...markdownErrors],
    tags: [...tags, ...markdownTags, method, url, 'endpoint'],
    blocks: [
      ...markdown.blocks,
      {
        description: '',
        type: 'openApi3',
        headers,
        security: [],
        summary: '',
        // requestBody: null, // todo implementar schema
        payload,
        parameters: null,
        responses: [],

        url,
        method
      }
    ]
  };
};
