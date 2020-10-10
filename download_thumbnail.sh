#!/bin/sh

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

[[ -f "$file_path" ]] && {
  echo "thumbnail already exists at $file_path, doing nothing"
  exit 0
}

api="https://www.googleapis.com/books/v1/volumes?q=ISBN:$isbn&key=$GOOGLE_BOOKS_API_KEY"

search_results=$(curl "$api")

thumbnail_url=$(echo "$search_results" | jq -r ".items[0].volumeInfo.imageLinks.smallThumbnail")

[[ "$thumbnail_url" == "" ]] || [[ "$thumbnail_url" == "null" ]] && {
  echo "Problem retrieving the thumbnail url for $isbn. Found JSON: "
  echo "$search_results" | jq
  exit 1
}

curl $thumbnail_url > "$file_path"

echo "Saved thumbnail to $file_path"
