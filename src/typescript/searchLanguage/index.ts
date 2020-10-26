import { Book } from '../book';
import * as parser from './parse';

export interface Expression {
  matches(book: Book): boolean;
  toHtml(): string;
}

class AndExpressionList implements Expression {
  private expressions: Expression[];
  constructor(left: Expression, right: Expression) {
    this.expressions = [left, right];
  }

  matches(book) {
    return this.expressions.every(expression => expression.matches(book));
  }

  toString() { return `${this.expressions[0]} AND ${this.expressions[1]}`; }

  toHtml() {
    return `
      <div class='search-term'>
        ${this.expressions[0].toHtml()}
        <span class='search-term__label'>AND</span>
        ${this.expressions[1].toHtml()}
      </div>
    `;
  }
}

class OrExpressionList implements Expression {
  private expressions: Expression[];
  constructor(left: Expression, right: Expression) {
    this.expressions = [left, right];
  }

  matches(book) {
    return this.expressions.some(expression => expression.matches(book));
  }

  toString() { return `${this.expressions[0]} OR ${this.expressions[1]}`; }

  toHtml() {
    return `
      <div class='search-term'>
        ${this.expressions[0].toHtml()}
        <span class='search-term__label'>OR</span>
        ${this.expressions[1].toHtml()}
      </div>
    `;
  }
}

class NotExpressionList implements Expression {
  private expression: Expression;
  constructor(expression) {
    this.expression = expression;
  }

  matches(book) {
    return !this.expression.matches(book);
  }

  toString() { return `NOT (${this.expression})`; }

  toHtml() {
    return `
      <div class='search-term'>
        <span class='search-term__label'>NOT</span>
        ${this.expression.toHtml()}
      </div>
    `;
  }
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
    return value.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
  }

  toString() { return `${this.scope}:${this.search}`; }

  toHtml() {
    return `
      <span class='search-term search-term__leaf'>
        ${this.scope}=${this.search}
      </span>
    `;
  }
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

  toHtml() {
    return `
      <span class='search-term search-term__leaf'>${this.search}</span>
    `;
  }
}

class YesExpression implements Expression {
  matches() { return true; }
  toHtml() { return ''; }
}

function objectify(parsed) {
  switch (parsed.type) {
    case 'yes':
      return new YesExpression();
    case 'and':
      return new AndExpressionList(...parsed.value.map(objectify) as any as [Expression, Expression]);
    case 'or': 
      return new OrExpressionList(...parsed.value.map(objectify) as any as [Expression, Expression]);
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
  return objectify(parser.parse(search, { ignoreAmbiguity: true }));
}
