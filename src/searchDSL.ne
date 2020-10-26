# This file is used to generate src/typescript/searchLanguage/parse.ts
@{%
const moo = require("moo");

let and: any;
let or: any;
let space: any;
let colon: any;
let word: any;
let quotedWord: any;
let lParen: any;
let rParen: any;

const lexer = moo.compile({
  quotedWord: /"[^"\n]+"/,
  word:       /[^\s:)(]+/,
  and:        / AND /,
  or:         / OR /,
  space:      / /,
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
%}
expression -> 
    secondOrderOfOperation {% id %}
  | thirdOrderOfOperation {% id %}
firstOrderOfOpereration ->
    terminal {% id %}
  | %lParen expression %rParen {% ([_, expression, __]) => expression %}
secondOrderOfOperation ->
    firstOrderOfOpereration {% id %}
  | secondOrderOfOperation %or firstOrderOfOpereration {% orSearchExpressionProcessor %}
thirdOrderOfOperation ->
    expression %and expression {% andSearchExpressionProcessor %}
  | expression %space expression {% andSearchExpressionProcessor %}
terminal -> 
    scopedSearch {% id %}
  | wordSearch {% id %}
  | %quotedWord {% quotedWordSearchTermProcessor %}
scopedSearch -> %word %colon %word {% scopedSearchTermProcessor %}
wordSearch -> %word {% wordSearchTermProcessor %}
