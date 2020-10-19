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

    toString() { return this.expressions.length > 1 ? `AND(${this.expressions.join(',')})` : this.expressions.length[0]; }
  }

  class OrExpressionList /* implements Expression */ {
    constructor(...expressions) {
      this.expressions = expressions;
    }

    matches(book) {
      return this.expressions.some(expression => expression.matches(book));
    }

    toString() { return this.expressions.length > 1 ? `OR(${this.expressions.join(',')})` : this.expressions.length[0]; }
  }

  class NotExpressionList /* implements Expression */ {
    constructor(expression) {
      this.expression = expression;
    }

    matches(book) {
      return !this.expression.matches(book);
    }

    toString() { return `NOT(${this.expression})`; }
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

    toString() { return `${this.scope}:${this.search}`; }
  }

  class RegularSearchExpression /* implements Expression */ {
    constructor(search) {
      this.search = search;
    }

    matches(book) {
      return book.lowerCaseText.indexOf(this.search) >= 0;
    }

    toString() { return this.search; }
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

    appliesTo(text) {
      return text.match(this.pattern);
    }
  }

  function parseList(list, expressionFactory) {
    const rules = listItemRules;
    let rawList = list.trim();
    const expressions = [];
    while(rawList) {
      rules.some(rule => {
        const match = rule.appliesTo(rawList);
        if (match) {
          rawList = rawList.replace(match[0], '').trim();
          expressions.push(rule.expressionFactory(...match));
          return true;
        }
        return false;
      });
    }

    return expressionFactory(...expressions);
  }

  function parseListParent(expressionString) {
    const rules = listParentRules;
    const text = expressionString.trim();
    for (const rule of rules) {
      const match = rule.appliesTo(text);
      if (match) { 
        return rule.expressionFactory(...match);
      }
    }
  }

  const listParentRules = [
    new Rule(/^$/,                    () => new YesExpression()),
    new Rule(/^OR\((.*)\)$/,   (_, list) => parseList(list, (...x) => new OrExpressionList(...x))),
    new Rule(/^AND\((.*)\)$/i, (_, list) => parseList(list, (...x) => new AndExpressionList(...x))),
    new Rule(/^NOT\((.*)\)$/i, (_, list) => new NotExpressionList(parseListParent(list))),
    new Rule(/^\((.*)\)$/,     (_, list) => parseList(list, (...x) => new AndExpressionList(...x))),
    new Rule(/^.*$/,                list => parseList(list, (...x) => new AndExpressionList(...x)))
  ];

  const listItemRules = [
    new Rule(/OR\((.*)\)( |$)/i,   (_, list) => parseList(list, (...x) => new OrExpressionList(...x))),
    new Rule(/AND\((.*)\)( |$)/i,  (_, list) => parseList(list, (...x) => new AndExpressionList(...x))),
    new Rule(/NOT\((.*)\)( |$)/i,  (_, list) => new NotExpressionList(parseListParent(list))),
    new Rule(/([^:]+:[^:]+)( |$)/, (_, text) => new ScopedSearchExpression(...text.split(':'))),
    new Rule(/([^ ]+)( |$)/,       (_, text) => new RegularSearchExpression(text))
  ];

  return {
    parse: parseListParent
  }
}());


