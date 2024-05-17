import { getMethodAndUrl } from './getMethodAndUrl';

describe('getMethodAndUrl', () => {
  it('should get method and url', () => {
    expect(getMethodAndUrl('PUT exampleurl HTTP/1.1')).toEqual({ method: 'PUT', url: 'exampleurl' });
  });
});
