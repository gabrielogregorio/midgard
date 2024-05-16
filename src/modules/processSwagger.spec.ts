import { processSwagger } from './processSwagger';

const fileInput = './docs/adr/file.md';

const mockContext = { context: 'example.tag', name: 'name' };

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

    const resultEnd = processSwagger(mainInput, mockContext, fileInput);

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

    const resultEnd = processSwagger(mainInput, mockContext, fileInput);

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

    const resultEnd = processSwagger(mainInput, mockContext, fileInput);

    expect(resultEnd).toEqual([]);
  });
});
