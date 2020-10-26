# This file is used to generate src/typescript/searchLanguage/parse.ts
@{%
const moo = require("moo");

let and: any;
let or: any;
let not: any;
let _: any;
let colon: any;
let word: any;
let quotedWord: any;
let lParen: any;
let rParen: any;

const lexer = moo.compile({
  quotedWord: /"[^"\n]+"/,
  and:        /[ \t]*AND[ \t]*/,
  or:         /[ \t]*OR[ \t]*/,
  not:        /[ \t]*NOT[ \t]*/,
  word:       /[^\s:)(]+/,
  _:          /[ \t]+/,
  colon:      /:/,
  lParen:     /\(/,
  rParen:     /\)/,
});
%}

@lexer lexer
@builtin "whitespace.ne"

@{%

  function stripQuotes(text) {
    return text.match(/"(.*)"/)[1];
  }

  const quotedWordSearchTermProcessor = ([ word ]) => ({
    type: 'search',
    value: stripQuotes(word.text)
  });

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

  const quotedScopedSearchTermProcessor = ([ scope, _, search ]) => ({
    type: 'scoped',
    value: {
      scope: scope.text,
      search: stripQuotes(search.text)
    }
  });

  const andExpressionProcessor = ([left, _, right]) => ({
    type: 'and',
    value: [left, right]
  });

  const orExpressionProcessor = ([left, _, right]) => ({
    type: 'or',
    value: [left, right]
  });

  const notExpressionProcessor = ([_, __, expression, ___]) => ({
    type: 'not',
    value: expression
  });
%}
expression -> 
    secondOrderOfOperation {% id %}
  | thirdOrderOfOperation {% id %}
firstOrderOfOpereration ->
    terminal {% id %}
  | %not %lParen expression %rParen {% notExpressionProcessor %}
  | %lParen expression %rParen {% ([_, expression, __]) => expression %}
secondOrderOfOperation ->
    firstOrderOfOpereration {% id %}
  | secondOrderOfOperation %or firstOrderOfOpereration {% orExpressionProcessor %}
thirdOrderOfOperation ->
    expression %and expression {% andExpressionProcessor %}
  | expression %_ expression {% andExpressionProcessor %}
terminal -> 
    scopedSearch {% id %}
  | wordSearch {% id %}
  | %quotedWord {% quotedWordSearchTermProcessor %}
scopedSearch -> 
    %word %colon %word {% scopedSearchTermProcessor %}
  | %word %colon %quotedWord {% quotedScopedSearchTermProcessor %}
wordSearch -> %word {% wordSearchTermProcessor %}
