#!/bin/sh

[[ "$GOOGLE_BOOKS_API_KEY" == "" ]] && {
  echo "Missing API key for Google books. Expected \$GOOGLE_BOOKS_API_KEY to contain the key"
  exit 1
}

isbn=$1

[[ "$isbn" == "" ]] && {
  echo "Missing isbn parameter"
  exit 1
}

api="https://www.googleapis.com/books/v1/volumes?q=isbn:$isbn&key=$GOOGLE_BOOKS_API_KEY"

thumbnail_url=$(curl "$api" | jq -r ".items[0].volumeInfo.imageLinks.smallThumbnail")

[[ "$thumbnail_url" == "" ]] && {
  echo "Problem retrieving the thumbnail url"
  exit 1
}

curl $thumbnail_url > $isbn

echo "Saved thumbnail to ./$isbn"
