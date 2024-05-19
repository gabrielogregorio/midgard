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
      originName: 'backend',
      handlerName: 'process-swagger',
      blocks: [
        {
          markdown: '# summary-example\ndescription-example\n',
          type: 'md',
          subType: 'normal'
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
        {
          type: 'md',
          subType: 'normal',
          markdown: '#    '
        },
        {
          type: 'request',
          method: '',
          headers: {},
          payload: '',
          url: ''
        }
      ],
      originName: 'bot',
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
        {
          type: 'md',
          subType: 'normal',
          markdown: '# example-request\n   '
        },
        {
          type: 'request',
          method: 'GET',
          headers: {},
          payload: '',
          url: "'http://example.com.br'/bot"
        }
      ],
      originName: 'bot',
      handlerName: 'collect-http'
    },
    {
      title: 'This is a md file',
      warning: [],
      errors: [],
      tags: ['combratec', 'squads', 'docbytest', 'frontend', 'env', 'e2e', 'frontend', 'example', 'md'],
      blocks: [
        {
          type: 'md',
          subType: 'normal',
          markdown: '# This is a md file\n'
        }
      ],
      originName: 'frontend',
      handlerName: 'process-markdown'
    },
    {
      title: 'this is a reference file',
      warning: [],
      errors: [],
      tags: ['combratec', 'squads', 'docbytest', 'frontend', 'env', 'e2e', 'frontend', 'src', 'examplefile', 'md', 'ref1', 'ref2'],
      blocks: [
        {
          type: 'md',
          subType: 'normal',
          markdown: '# this is a reference file\n'
        },
        {
          type: 'tag',
          subType: 'normal',
          markdown: 'tags: [ref1, ref2]'
        },
        {
          type: 'md',
          subType: 'normal',
          markdown: 'this is a body\n'
        }
      ],
      originName: 'frontend',
      handlerName: 'process-markdown'
    }
  ],
  hierarchy: [
    {
      tags: ['combratec', ' squads', 'docbytest', 'backend'],
      title: '🛢️ Backend'
    },
    {
      tags: ['combratec', ' squads', 'marketing', 'bot'],
      title: '🤖 Bot'
    },
    {
      tags: ['combratec', ' squads', 'docbytest', 'frontend'],
      title: '⭐ Frontend'
    }
  ]
};

describe('e2e', () => {
  it('e2e test', () => {
    const result = processSchema('./env/e2e/config.json');
    expect(result).toEqual(responseExpected);
  });
});
