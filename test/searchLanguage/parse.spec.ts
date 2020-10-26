import { parse } from '../../src/typescript/searchLanguage/parse';

describe('searchLanguage parser', () => {
  it('parses one word search terms', () => {
    expect(parse(`hello`)).toEqual({ type: 'search', value: 'hello' });
  });

  it('parses multi-word search terms as an and expression', () => {
    expect(parse(`hello world`)).toEqual({ type: 'and', value: [
      { type: 'search', value: 'hello' },
      { type: 'search', value: 'world' },
    ]});
  });
});
