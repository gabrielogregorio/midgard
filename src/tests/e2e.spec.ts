/* eslint-disable sonarjs/no-duplicate-string */
import { processSchema } from '../processSchema';

const responseExpected = {
  schema: [
    {
      tags: [
        'combratec',
        'squads',
        'docbytest',
        'backend',
        'env',
        'e2e',
        'backend',
        'code',
        'ts',
        'swagger',
        'endpoint',
        'post',
        '/example/endpoint/',
        'tag1',
        'tag2'
      ],
      originName: 'combratec.squads.docbytest.backend',
      handlerName: 'process-swagger',
      errors: [],
      blocks: [
        {
          type: 'openApi3',
          method: 'post',
          description: 'description-example\n',
          summary: 'summary-example',
          url: '/example/endpoint/',
          sceneries: [
            {
              params: {},
              summary: 'summary-example',
              description: 'Sem exemplos de resposta',
              headers: {},
              payload: { message: 'hello world' },
              response: { example: '', status: 0 }
            }
          ]
        }
      ],
      title: 'summary-example'
    },
    {
      title: ' ',
      errors: [],
      warning: [],
      tags: ['combratec', 'squads', 'marketing', 'bot', 'env', 'e2e', 'bot', 'example', 'http', '', '', 'endpoint'],
      blocks: [
        { type: 'md', subType: 'normal', markdown: '#    ' },
        {
          description: '',
          type: 'openApi3',
          summary: '',
          sceneries: [
            {
              description: '',
              summary: '',
              headers: {},
              payload: '',
              params: {},
              response: { example: 'Sem exemplos de resposta', status: 0 }
            }
          ],
          url: '',
          method: ''
        }
      ],
      originName: 'combratec.squads.marketing.bot',
      handlerName: 'collect-http'
    },
    {
      title: 'example-request',
      errors: [],
      warning: [],
      tags: [
        'combratec',
        'squads',
        'marketing',
        'bot',
        'env',
        'e2e',
        'bot',
        'example',
        'http',
        'GET',
        "'http://example.com.br'/bot",
        'endpoint'
      ],
      blocks: [
        { type: 'md', subType: 'normal', markdown: '# example-request\n   ' },
        {
          description: '',
          type: 'openApi3',
          summary: '',
          sceneries: [
            {
              description: '',
              summary: '',
              headers: {},
              payload: '',
              params: {},
              response: { example: 'Sem exemplos de resposta', status: 0 }
            }
          ],
          url: "'http://example.com.br'/bot",
          method: 'GET'
        }
      ],
      originName: 'combratec.squads.marketing.bot',
      handlerName: 'collect-http'
    },
    {
      title: 'This is a md file',
      warning: [],
      errors: [],
      tags: ['combratec', 'squads', 'docbytest', 'frontend', 'env', 'e2e', 'frontend', 'example', 'md'],
      blocks: [{ type: 'md', subType: 'normal', markdown: '# This is a md file\n' }],
      originName: 'combratec.squads.docbytest.frontend',
      handlerName: 'process-markdown'
    },
    {
      title: 'this is a reference file',
      warning: [],
      errors: [],
      tags: ['combratec', 'squads', 'docbytest', 'frontend', 'env', 'e2e', 'frontend', 'src', 'examplefile', 'md', 'ref1', 'ref2'],
      blocks: [
        { type: 'md', subType: 'normal', markdown: '# this is a reference file\n' },
        { type: 'tag', subType: 'normal', markdown: 'tags: [ref1, ref2]' },
        { type: 'md', subType: 'normal', markdown: 'this is a body\n' }
      ],
      originName: 'combratec.squads.docbytest.frontend',
      handlerName: 'process-markdown'
    }
  ],
  hierarchy: [
    { tags: ['combratec', 'squads', 'docbytest', 'backend'], title: '🛢️ Backend' },
    { tags: ['combratec', 'squads', 'marketing', 'bot'], title: '🤖 Bot' },
    { tags: ['combratec', 'squads', 'docbytest', 'frontend'], title: '⭐ Frontend' }
  ]
};

describe('e2e', () => {
  it('e2e test', () => {
    const result = processSchema('./env/e2e/config.json');
    expect(result).toEqual(responseExpected);
  });
});
