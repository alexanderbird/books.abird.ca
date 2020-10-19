const searchLanguage = (function() {

  /* interface Expression {
   *   constructor(text: String);
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

  /* ---- */

  class Rule {
    constructor(pattern, expressionFactory) {
      this.pattern = pattern;
      this.expressionFactory = expressionFactory;
    }
  }

  const listExpressionRules = [
    new Rule(/^$/, () => new YesExpression()),
    new Rule(/^.*$/, list => new AndExpressionList(...list.toLowerCase().split(' ')
      .map(expression => parseSingleSearchExpression(expression))))
  ];

  function parseSearchExpressionList(expressionString = '') {
    const text = expressionString.trim();
    const rule = listExpressionRules.find(r => text.match(r.pattern));
    return rule.expressionFactory(text);
  }

  const singleExpressionRules = [
    new Rule(/[^:]+:[^:]+( |$)/, text => new ScopedSearchExpression(...text.split(':'))),
    new Rule(/[^ ]+( |$)/, text => new RegularSearchExpression(text))
  ];

  function parseSingleSearchExpression(text) {
    const rule = singleExpressionRules.find(r => text.match(r.pattern));
    return rule.expressionFactory(text);
  }

  return {
    parse: parseSearchExpressionList
  }
}());


