#!/bin/bash

isbn="$1"

# Redirect to stderr so that this line isn't part of the JSON output
echo "Determining average color for $isbn" >&2

color="$(convert data/thumbnails/$isbn -resize 1x1 txt:- | grep -Eo "#[0-9A-Fa-f]{6}")"

echo "{ \"$isbn\": \"$color\" }"
