import { processHandlerType } from '../../../modules/types';
import * as generateId from '../../../utils/generateId';
import { findLocalFileReferences } from './findLocalFileReferences';

process.env.PORT = '3333';

const spy = jest.spyOn(generateId, 'generateId');
spy.mockImplementation(() => 'idMock');
const config: processHandlerType = {
  tags: ['example', 'tag', 'name'],
  bannedPaths: [],
  directory: '',
  title: ''
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
