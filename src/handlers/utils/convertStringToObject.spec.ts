import { convertStringToObject } from './convertStringToObject';

describe('', () => {
  it('should convert string to object', () => {
    expect(convertStringToObject('{ "example": "aa"}')).toEqual({ example: 'aa' });
  });

  it('should convert string to object with invalid ,', () => {
    expect(convertStringToObject('{ "example": "aa",}')).toEqual({ example: 'aa' });
  });

  it('should complex object with dots ,', () => {
    expect(convertStringToObject('{ \n"example": { "name": "example2",},}')).toEqual({ example: { name: 'example2' } });
  });
});
