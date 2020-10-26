import { Book } from '../book';
import * as parser from './parse';

interface Expression {
  matches(book: Book): boolean;
}

class AndExpressionList implements Expression {
  private expressions: Expression[];
  constructor(...expressions) {
    this.expressions = expressions;
  }

  matches(book) {
    return this.expressions.every(expression => expression.matches(book));
  }

  toString() { return this.expressions.length > 1 ? `AND(${this.expressions.join(',')})` : this.expressions.length[0]; }
}

class OrExpressionList implements Expression {
  private expressions: Expression[];
  constructor(...expressions) {
    this.expressions = expressions;
  }

  matches(book) {
    return this.expressions.some(expression => expression.matches(book));
  }

  toString() { return this.expressions.length > 1 ? `OR(${this.expressions.join(',')})` : this.expressions.length[0]; }
}

class NotExpressionList implements Expression {
  private expression: Expression;
  constructor(expression) {
    this.expression = expression;
  }

  matches(book) {
    return !this.expression.matches(book);
  }

  toString() { return `NOT(${this.expression})`; }
}

class ScopedSearchExpression implements Expression {
  private scope: string;
  private search: string;
  constructor(scope, search) {
    this.scope = scope;
    this.search = search;
  }

  matches(book) {
    const value = book.getDataSetEntry(this.scope);
    return value.toLowerCase().indexOf(this.search) >= 0;
  }

  toString() { return `${this.scope}:${this.search}`; }
}

class RegularSearchExpression implements Expression {
  private search: string;

  constructor(search) {
    this.search = search;
  }

  matches(book) {
    return book.lowerCaseText.indexOf(this.search) >= 0;
  }

  toString() { return this.search; }
}

class YesExpression implements Expression {
  matches() { return true; }
}

function objectify(parsed) {
  switch (parsed.type) {
    case 'and':
      return new AndExpressionList(parsed.value.map(objectify));
    case 'or': 
      return new OrExpressionList(parsed.value.map(objectify));
    case 'not':
      return new NotExpressionList(objectify(parsed.value));
    case 'search':
      return new RegularSearchExpression(parsed.value);
    case 'scoped':
      return new ScopedSearchExpression(parsed.value.scope, parsed.value.search);
    default:
      throw new Error(`Unknown search node type: ${parsed.type}`);
  }
}


export function parse(search: string): Expression {
  return objectify(parser.parse(search));
}
