import { parse } from '../../src/typescript/searchLanguage/parse';
import { simplify } from '../../src/typescript/searchLanguage/simpleSerializer';

describe('searchLanguage parser', () => {
  it('accepts empty strings', () => {
    expect(parse('')).toEqual({ type: 'yes' });
  });

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

  it('prioritizes AND over OR', () => {
    const parsed = parse('one OR two AND three OR four');
    expect(simplify(parsed)).toEqual('and(or(one two) or(three four))');
  });

  it('prioritizes parentheses over AND', () => {
    const parsed = parse('one OR (two AND three) OR four');
    expect(simplify(parsed)).toEqual('or(or(one and(two three)) four)');
  });

  it('prioritizes quotes over everything', () => {
    expect(parse('"one OR (two AND three) OR four" OR "another:one"')).toEqual({ type: 'or', value: [
      { type: 'search', value: 'one OR (two AND three) OR four' },
      { type: 'search', value: 'another:one' },
    ]});
  });

  it('is permissive about whitespace', () => {
    const parsed = parse('one     OR\t \ttwo   AND(three)');
    expect(simplify(parsed)).toEqual('and(or(one two) three)');
  });

  it('supports NOT search', () => {
    expect(parse('NOT (foo)')).toEqual({ type: 'not', value: { type: 'search', value: 'foo' } });
  });

  it('supports NOT scoped search', () => {
    expect(parse('NOT (foo:bar)')).toEqual({ type: 'not', value: {
      type: 'scoped',
      value: {
        scope: 'foo',
        search: 'bar'
      }
    }});
  });

  it('has correct order of operations for NOT', () => {
    const parsed = parse('(NOT(foo) AND NOT(apple)) OR NOT (one)');
    expect(simplify(parsed)).toEqual('or(and(not(foo) not(apple)) not(one))');
  });

});
