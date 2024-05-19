import { getMethodAndUrl } from './getMethodAndUrl';

describe('getMethodAndUrl', () => {
  it('should get method and url', () => {
    expect(getMethodAndUrl('PUT exampleurl HTTP/1.1')).toEqual({ method: 'PUT', url: 'exampleurl' });
  });

  it('should get method and url', () => {
    expect(getMethodAndUrl('PUT {{baseUrl}}/v7/docs/:id/items HTTP/1.1')).toEqual({ method: 'PUT', url: '{{baseUrl}}/v7/docs/:id/items' });
  });

  it('should get method and url without http method', () => {
    expect(getMethodAndUrl('PUT exampleurl')).toEqual({ method: 'PUT', url: 'exampleurl' });
  });
});
