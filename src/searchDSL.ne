# This file is used to generate src/typescript/searchLanguage/parse.ts
@{%
const moo = require("moo");

let and: any;
let or: any;
let space: any;
let colon: any;
let word: any;
let lParen: any;
let rParen: any;

const lexer = moo.compile({
  and:    / AND /,
  or:     / OR /,
  space:  / /,
  colon:  /:/,
  word:   /[^\s:)(]+/,
  lParen: /\(/,
  rParen: /\)/,
});
%}

@lexer lexer

@{%
  const wordSearchTermProcessor = ([ word ]) => ({
    type: 'search',
    value: word.text
  });

  const scopedSearchTermProcessor = ([ scope, _, search ]) => ({
    type: 'scoped',
    value: {
      scope: scope.text,
      search: search.text
    }
  });

  const andSearchExpressionProcessor = ([left, _, right]) => ({
    type: 'and',
    value: [left, right]
  });

  const orSearchExpressionProcessor = ([left, _, right]) => ({
    type: 'or',
    value: [left, right]
  });
%}
searchExpression -> 
    orSearchExpression {% id %}
  | searchExpression %and searchExpression {% andSearchExpressionProcessor %}
  | searchExpression %space searchExpression {% andSearchExpressionProcessor %}
orSearchExpression ->
    searchTermExpression {% id %}
  | orSearchExpression %or searchTermExpression {% orSearchExpressionProcessor %}
searchTermExpression ->
    searchTerm {% id %}
  | %lParen searchExpression %rParen {% ([_, expression, __]) => expression %}
searchTerm -> 
    scopedSearchTerm {% id %}
  | wordSearchTerm {% id %}
scopedSearchTerm -> %word %colon %word {% scopedSearchTermProcessor %}
wordSearchTerm -> %word {% wordSearchTermProcessor %}
