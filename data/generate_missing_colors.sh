#!/bin/bash

isbns_without_colors="$(diff --new-line-format="" --unchanged-line-format="" \
    <(ls data/thumbnails/ | sort) \
    <(cat data/colors.json | jq -r "keys | .[]" | sort) \
    2>&1)"

[[ "$isbns_without_colors" == "" ]] && exit 0

echo -E "$isbns_without_colors" \
  | xargs -n 1 data/average_color.sh \
  | jq --slurp 'add' | jq --argfile original ./data/colors.json '. * $original' > /tmp/colors.json

mv /tmp/colors.json ./data/colors.json
