import { parse } from '../../src/typescript/searchLanguage/parse';

describe('searchLanguage parser', () => {
  it('parses one word search terms', () => {
    expect(parse('hello')).toEqual({ type: 'search', value: 'hello' });
  });

  it('parses scoped search terms', () => {
    expect(parse('foo:bar')).toEqual({ type: 'scoped', value: { scope: 'foo', search: 'bar' } });
  });

  it('parses multi-word search terms as an and expression', () => {
    expect(parse('hello world')).toEqual({ type: 'and', value: [
      { type: 'search', value: 'hello' },
      { type: 'search', value: 'world' },
    ]});
  });

  it('parses AND expressions', () => {
    expect(parse('hello AND world')).toEqual({ type: 'and', value: [
      { type: 'search', value: 'hello' },
      { type: 'search', value: 'world' },
    ]});
  });

  it('parses OR expressions', () => {
    expect(parse('hello OR world')).toEqual({ type: 'or', value: [
      { type: 'search', value: 'hello' },
      { type: 'search', value: 'world' },
    ]});
  });
});
