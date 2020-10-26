# This file is used to generate src/typescript/searchLanguage/parse.ts

search -> 
    searchTerm {% id %}
  | searchTerm " " search {% ([left, _, right]) => ({ type: 'and', value: [left, right] }) %}
searchTerm -> [^ ]:+ {% ([word]) => ({ type: 'search', value: word.join('') }) %}
