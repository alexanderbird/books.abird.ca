const searchLanguage = (function() {
  /* interface Expression {
   *   matches(book: Book): boolean;
   * }
   */

  class AndExpressionList /* implements Expression */ {
    constructor(...expressions) {
      this.expressions = expressions;
    }

    matches(book) {
      return this.expressions.every(expression => expression.matches(book));
    }
  }

  function parseSingleSearchExpression(text) {
    if (text.indexOf(':') >= 0) {
      const [scope, search] = text.split(':');
      return new ScopedSearchExpression(scope, search);
    }
    return new RegularSearchExpression(text);
  }

  class ScopedSearchExpression /* implements Expression */ {
    constructor(scope, search) {
      this.scope = scope;
      this.search = search;
    }

    matches(book) {
      const value = book.getDataSetEntry(this.scope);
      return value.toLowerCase().indexOf(this.search) >= 0;
    }
  }

  class RegularSearchExpression /* implements Expression */ {
    constructor(search) {
      this.search = search;
    }

    matches(book) {
      return book.lowerCaseText.indexOf(this.search) >= 0;
    }
  }

  class YesExpression /* implements Expression */ {
    matches() { return true; }
  }

  function parseSearchExpressionList(expressionString) {
    if (!expressionString) return new YesExpression();
    const expressions = expressionString.toLowerCase().split(' ')
      .map(expression => parseSingleSearchExpression(expression));
    return new AndExpressionList(...expressions);
  }

  return {
    parse: parseSearchExpressionList
  }
}());


