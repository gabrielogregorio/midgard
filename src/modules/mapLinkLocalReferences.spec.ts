import * as generateId from '../utils/generateId';
import { mapLinkLocalReference } from './mapLinkLocalReference';
import { configFile } from './readConfigFile';

process.env.PORT = '3333';

const spy = jest.spyOn(generateId, 'generateId');
spy.mockImplementation(() => 'idMock');
const config: configFile = {
  context: 'example.tag',
  name: 'name'
};

describe('mapLinkLocalReference', () => {
  it('should returns empty on dont found image', () => {
    expect(mapLinkLocalReference({ content: ``, config })).toEqual([]);
    expect(mapLinkLocalReference({ content: `example any content`, config })).toEqual([]);
  });

  it('should resolve local relative image', () => {
    expect(mapLinkLocalReference({ content: `[this is a description](./thisIsLocalLink.md)`, config })).toEqual([
      {
        replaceTo: '[ref.example.tag.name.thisIsLocalLink.md]',
        search: '[this is a description](./thisIsLocalLink.md)'
      }
    ]);
  });

  it('should resolve local absolute image', () => {
    expect(mapLinkLocalReference({ content: `[this is a description](/thisIsLocalLink.md)`, config })).toEqual([
      {
        replaceTo: '[ref.example.tag.name.thisIsLocalLink.md]',
        search: '[this is a description](/thisIsLocalLink.md)'
      }
    ]);
  });

  it('should ignore images', () => {
    expect(mapLinkLocalReference({ content: `![this is a description](/thisIsLocalLink.md)`, config })).toEqual([]);
  });
  it('should resolve local ignore normal links image', () => {
    expect(mapLinkLocalReference({ content: `[this is a description](https://example)`, config })).toEqual([]);
  });
});
