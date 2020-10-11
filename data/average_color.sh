#!/bin/bash

isbn="$1"

color="$(convert data/thumbnails/$isbn -resize 1x1 txt:- | grep -Eo "#[0-9A-Fa-f]{6}")"

echo "{ \"$isbn\": \"$color\" }"
