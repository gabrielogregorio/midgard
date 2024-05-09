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
        content: [{ markdown: 'Cria uma nova indicação para o atendente' }],
        originName: 'name',
        handlerName: 'process-swagger',
        tags: ['swagger', 'endpoint', 'Autogeracação'],
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
        content: [{ markdown: 'text1\ntext2\n' }],
        originName: 'name',
        handlerName: 'process-swagger',
        tags: ['swagger', 'endpoint', 'Autogeracação'],
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
