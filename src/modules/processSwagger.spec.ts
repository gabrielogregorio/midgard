import { processSwagger } from './processSwagger';

const fileInput = './docs/adr/file.md';

describe('', () => {
  it('', () => {
    const mainInput = `
/**
 * @swagger
 * /example/otherExample:
 *  post:
 *    tags: [Autogeracação]
 *    summary: title example
 *    description: Cria uma nova indicação para o atendente
 *  */   
`;

    let resultEnd = processSwagger(mainInput, { context: 'example.tag', name: 'name' }, fileInput);

    expect(resultEnd).toEqual([
      {
        content: [{ markdown: '# title example\nCria uma nova indicação para o atendente', type: 'md', subType: 'normal' }],
        originName: 'name',
        handlerName: 'process-swagger',
        tags: ['swagger', 'endpoint', 'post', '/example/otherExample', 'Autogeracação'],
        title: 'title example'
      }
    ]);
  });

  it('', () => {
    const mainInput = `
/**
 * @swagger
 * /example/otherExample:
 *  post:
 *    tags: [Autogeracação]
 *    summary: title example
 *    description: | 
 *      text1
 *      text2
 *  */   
`;

    let resultEnd = processSwagger(mainInput, { context: 'example.tag', name: 'name' }, fileInput);

    expect(resultEnd).toEqual([
      {
        content: [{ markdown: '# title example\ntext1\ntext2\n', type: 'md', subType: 'normal' }],
        originName: 'name',
        handlerName: 'process-swagger',
        tags: ['swagger', 'endpoint', 'post', '/example/otherExample', 'Autogeracação'],
        title: 'title example'
      }
    ]);
  });

  it('', () => {
    const mainInput = `
    /**
     * @swagger
     * components:
     *  schemas:
     *    any example
    */
   `;

    let resultEnd = processSwagger(mainInput, { context: 'example.tag', name: 'name' }, fileInput);

    expect(resultEnd).toEqual([]);
  });
});
