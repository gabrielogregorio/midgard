import * as generateId from '../utils/generateId';
import { mapImages } from './mapImages';

process.env.PORT = '3333';

let spy = jest.spyOn(generateId, 'generateId');
spy.mockImplementation(() => 'idMock');

describe('mapImages', () => {
  it('should returns empty on dont found image', () => {
    expect(mapImages({ content: ``, pathMd: './example/' })).toEqual([]);
    expect(mapImages({ content: `example any content`, pathMd: './example/' })).toEqual([]);
  });

  it('should returns empty on found link', () => {
    expect(mapImages({ content: `[this is a link](linkExample)`, pathMd: './example/' })).toEqual([]);
  });

  it('should resolve local image', () => {
    expect(mapImages({ content: `![this is a description](./thisIsLocalLink.png)`, pathMd: './example/' })).toEqual([
      {
        copyFrom: 'example/thisIsLocalLink.png',
        copyTo: './public/idMock.png',
        replaceTo: '![this is a description](http://localhost:3333/idMock.png)',
        search: '![this is a description](./thisIsLocalLink.png)'
      }
    ]);
  });

  it('should resolve absolute image', () => {
    expect(mapImages({ content: `![this is a description](/home/thisIsLocalLink.png)`, pathMd: './any path' })).toEqual([
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
      mapImages({
        content: `[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/123abc)](https://app.codacy.com?utm_source=exanoke&utm_medium=other&utm_content=&utm_campaign=Badge_coverage) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/example2)](https://app.codacy.com?utm_source=gh&utm_medium=example2&utm_campaign=Badge_grade) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)`,
        pathMd: './anypath'
      })
    ).toEqual([]);
  });
});
