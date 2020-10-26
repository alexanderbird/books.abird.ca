// Edit the imports (top) and post-processing/exports (bottom) in nearleycompile_to_ts.sh
// Edit the grammar in src/searchDSL.ne
import nearley from 'nearley';
import { simplify } from './simpleSerializer';
// Generated automatically by nearley, version 2.19.7
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "expression", "symbols": ["secondOrderOfOperation"], "postprocess": id},
    {"name": "expression", "symbols": ["thirdOrderOfOperation"], "postprocess": id},
    {"name": "firstOrderOfOpereration", "symbols": ["terminal"], "postprocess": id},
    {"name": "firstOrderOfOpereration", "symbols": [(lexer.has("not") ? {type: "not"} : not), (lexer.has("lParen") ? {type: "lParen"} : lParen), "expression", (lexer.has("rParen") ? {type: "rParen"} : rParen)], "postprocess": notExpressionProcessor},
    {"name": "firstOrderOfOpereration", "symbols": [(lexer.has("lParen") ? {type: "lParen"} : lParen), "expression", (lexer.has("rParen") ? {type: "rParen"} : rParen)], "postprocess": ([_, expression, __]) => expression},
    {"name": "secondOrderOfOperation", "symbols": ["firstOrderOfOpereration"], "postprocess": id},
    {"name": "secondOrderOfOperation", "symbols": ["secondOrderOfOperation", (lexer.has("or") ? {type: "or"} : or), "firstOrderOfOpereration"], "postprocess": orExpressionProcessor},
    {"name": "thirdOrderOfOperation", "symbols": ["expression", (lexer.has("and") ? {type: "and"} : and), "expression"], "postprocess": andExpressionProcessor},
    {"name": "thirdOrderOfOperation", "symbols": ["expression", (lexer.has("_") ? {type: "_"} : _), "expression"], "postprocess": andExpressionProcessor},
    {"name": "terminal", "symbols": ["scopedSearch"], "postprocess": id},
    {"name": "terminal", "symbols": ["wordSearch"], "postprocess": id},
    {"name": "terminal", "symbols": [(lexer.has("quotedWord") ? {type: "quotedWord"} : quotedWord)], "postprocess": quotedWordSearchTermProcessor},
    {"name": "scopedSearch", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("word") ? {type: "word"} : word)], "postprocess": scopedSearchTermProcessor},
    {"name": "scopedSearch", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("colon") ? {type: "colon"} : colon), (lexer.has("quotedWord") ? {type: "quotedWord"} : quotedWord)], "postprocess": quotedScopedSearchTermProcessor},
    {"name": "wordSearch", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": wordSearchTermProcessor}
]
  , ParserStart: "expression"
}

export function parse(query: string, options: { ignoreAmbiguity?: boolean } = {}) {
  if (query.match(/^\s*$/)) { return { type: 'yes' }; }
  const nearleyParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  nearleyParser.feed(query);
  if (nearleyParser.results.length < 1) {
    throw new Error('Failed to parse. \n' + query);
  }
  if (!options.ignoreAmbiguity && nearleyParser.results.length > 1) {
    const summary = 'Bad bad bad. Grammar is ambiguous -- query has multiple valid interpretations';
    const details = nearleyParser.results.map(simplify).map(x => '  - ' + x).join('\n');
    const message = summary + ':\n' + query + '\n' + details;
    throw new Error(message);
  }
  return nearleyParser.results[0];
}

