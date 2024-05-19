import * as generateId from '../../../utils/generateId';
import { findLocalFileReferences } from './findLocalFileReferences';
import { configFile } from '../../../modules/readConfigFile';

process.env.PORT = '3333';

const spy = jest.spyOn(generateId, 'generateId');
spy.mockImplementation(() => 'idMock');
const config: configFile = {
  context: 'example.tag',
  name: 'name'
};

describe('findLocalFileReferences', () => {
  it("should returns empty on don't found image", () => {
    expect(findLocalFileReferences({ content: ``, config })).toEqual([]);
    expect(findLocalFileReferences({ content: `example any content`, config })).toEqual([]);
  });

  it('should resolve local relative image', () => {
    expect(findLocalFileReferences({ content: `[this is a description](./thisIsLocalLink.md)`, config })).toEqual([
      {
        replaceTo: '[ref.example.tag.name.thisIsLocalLink.md]',
        search: '[this is a description](./thisIsLocalLink.md)'
      }
    ]);
  });

  it('should resolve local absolute image', () => {
    expect(findLocalFileReferences({ content: `[this is a description](/thisIsLocalLink.md)`, config })).toEqual([
      {
        replaceTo: '[ref.example.tag.name.thisIsLocalLink.md]',
        search: '[this is a description](/thisIsLocalLink.md)'
      }
    ]);
  });

  it('should ignore images', () => {
    expect(findLocalFileReferences({ content: `![this is a description](/thisIsLocalLink.md)`, config })).toEqual([]);
  });
  it('should resolve local ignore normal links image', () => {
    expect(findLocalFileReferences({ content: `[this is a description](https://example)`, config })).toEqual([]);
  });
});
