import { Context, PageType } from '../types';
import { extractCommentDocs } from './extractCommentDocs';
import { extractDocRequestGeneric } from './handlerDocRequestGeneric';

export class Main {
  static process(content: string, context: Context) {
    const comments = extractCommentDocs(content);

    let resultEnd: PageType[] = [];

    comments.forEach((item) => {
      if (item.type === 'doc-request-rules') {
        const rules = extractDocRequestGeneric(item.content, context);
        resultEnd.push({
          markdown: rules.doc
        });
        return;
      }

      if (item.type === 'doc-request') {
        const rules = extractDocRequestGeneric(item.content, context);
        resultEnd.push({
          name: `${rules.method}${rules.url}`,
          method: rules.method,
          path: rules.url,
          description: rules.doc
        });

        return;
      }

      throw new Error(`the comment type "${item.type}" is not valid in file "${context.file}"`);
    });

    return resultEnd;
  }
}
