# This file is used to generate src/typescript/searchLanguage/parse.ts
@{%
const moo = require("moo");

let and: any;
let or: any;
let space: any;
let colon: any;
let word: any;

const lexer = moo.compile({
  and:    / AND /,
  or:     / OR /,
  space:  / /,
  colon:  /:/,
  word:   /[^\s:]+/
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
    searchTerm {% id %}
  | searchTerm %and searchExpression {% andSearchExpressionProcessor %}
  | searchTerm %or searchExpression {% orSearchExpressionProcessor %}
  | searchTerm %space searchExpression {% andSearchExpressionProcessor %}
searchTerm -> 
    scopedSearchTerm {% id %}
  | wordSearchTerm {% id %}
scopedSearchTerm -> %word %colon %word {% scopedSearchTermProcessor %}
wordSearchTerm -> %word {% wordSearchTermProcessor %}
