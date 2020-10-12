#!/bin/bash

source .env || echo "Skipped loading .env"

[[ "$GOOGLE_BOOKS_API_KEY" == "" ]] && {
  echo "Missing API key for Google books. Expected \$GOOGLE_BOOKS_API_KEY to contain the key"
  exit 1
}

isbn=$1

[[ "$isbn" == "" ]] && {
  echo "Missing isbn parameter"
  exit 1
}

file_path="./build/$isbn"

api="https://www.googleapis.com/books/v1/volumes?q=ISBN:$isbn&orderBy=relevance&key=$GOOGLE_BOOKS_API_KEY"

rm -f /tmp/search_results.{json,html}

search_results="$(curl "$api")"

[[ "$(echo -E "$search_results" | jq -r .totalItems)" == "0" ]] && {
  echo "Zero results for $isbn 🤷"
  exit 1
}

echo -E "$search_results" \
  | tr '\r\n' ' ' \
  | jq "{ isbn: \"$isbn\", results: [ $(cat search/search_results_schema.jq) ] }" \
  > /tmp/search_results.json

pug search/search_results.pug --out /tmp -O /tmp/search_results.json

open /tmp/search_results.html
