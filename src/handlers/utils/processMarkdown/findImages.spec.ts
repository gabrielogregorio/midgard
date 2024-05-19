import * as generateId from '../../../utils/generateId';
import { findImages } from './findImages';

process.env.PORT = '3333';

const spy = jest.spyOn(generateId, 'generateId');
spy.mockImplementation(() => 'idMock');

const pathFile = './example/';

describe('findImages', () => {
  it("should returns empty on don't found image", () => {
    expect(findImages({ content: ``, pathFile })).toEqual([]);
    expect(findImages({ content: `example any content`, pathFile })).toEqual([]);
  });

  it('should returns empty on found link', () => {
    expect(findImages({ content: `[this is a link](linkExample)`, pathFile })).toEqual([]);
  });

  it('should resolve local image', () => {
    expect(findImages({ content: `![this is a description](./thisIsLocalLink.png)`, pathFile })).toEqual([
      {
        copyFrom: 'example/thisIsLocalLink.png',
        copyTo: './public/idMock.png',
        replaceTo: '![this is a description](http://localhost:3333/idMock.png)',
        search: '![this is a description](./thisIsLocalLink.png)'
      }
    ]);
  });

  it('should resolve absolute image', () => {
    expect(findImages({ content: `![this is a description](/home/thisIsLocalLink.png)`, pathFile: './any path' })).toEqual([
      {
        copyFrom: '/home/thisIsLocalLink.png',
        copyTo: './public/idMock.png',
        replaceTo: '![this is a description](http://localhost:3333/idMock.png)',
        search: '![this is a description](/home/thisIsLocalLink.png)'
      }
    ]);
  });

  it('should not resolve external image', () => {
    expect(
      findImages({
        content: `[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/123abc)](https://app.codacy.com?utm_source=exanoke&utm_medium=other&utm_content=&utm_campaign=Badge_coverage) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/example2)](https://app.codacy.com?utm_source=gh&utm_medium=example2&utm_campaign=Badge_grade) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)`,
        pathFile: './anypath'
      })
    ).toEqual([]);
  });
});
