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

@{%

  const quotedWordSearchTermProcessor = ([ word ]) => ({
    type: 'search',
    value: word.text.match(/"(.*)"/)[1]
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

  const andSearchExpressionProcessor = ([left, _, right]) => ({
    type: 'and',
    value: [left, right]
  });

  const orSearchExpressionProcessor = ([left, _, right]) => ({
    type: 'or',
    value: [left, right]
  });

  const notSearchExpressionProcessor = ([_, expression]) => ({
    type: 'not',
    value: expression
  });
%}
expression -> 
    %not expression {% notSearchExpressionProcessor %}
  | secondOrderOfOperation {% id %}
  | thirdOrderOfOperation {% id %}
firstOrderOfOpereration ->
    terminal {% id %}
  | %lParen expression %rParen {% ([_, expression, __]) => expression %}
secondOrderOfOperation ->
    firstOrderOfOpereration {% id %}
  | secondOrderOfOperation %or firstOrderOfOpereration {% orSearchExpressionProcessor %}
thirdOrderOfOperation ->
    expression %and expression {% andSearchExpressionProcessor %}
  | expression %_ expression {% andSearchExpressionProcessor %}
terminal -> 
    scopedSearch {% id %}
  | wordSearch {% id %}
  | %quotedWord {% quotedWordSearchTermProcessor %}
scopedSearch -> %word %colon %word {% scopedSearchTermProcessor %}
wordSearch -> %word {% wordSearchTermProcessor %}
