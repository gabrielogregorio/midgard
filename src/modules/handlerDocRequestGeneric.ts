import { CustomError } from '../error';
import { Context } from '../types';

const extractRequestAndMethod = /REQUEST\s{0,}:\s{0,}(\w{1,})\s{1,}([\w{1,}\/]{1,})/;

export const extractDocRequestGeneric = (content: string, context: Context) => {
  const result = content.match(extractRequestAndMethod);

  if (!result) {
    throw new CustomError(`error on extract method and url from string "${JSON.stringify(content)}" in file ${context.file}`);
  }

  const doc = content.replace(result[0], '');

  return {
    method: result[1],
    url: result[2],
    doc: doc
  };
};
