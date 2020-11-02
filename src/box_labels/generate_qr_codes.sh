url="$1"
outpath="$2"

[[ "$url" == "" ]] && { echo "Missing URL parameter"; exit 1; }
[[ "$outpath" == "" ]] && { echo "Missing output path parameter"; exit 1; }

rm -r "./$outpath" || :
mkdir -p "./$outpath"

cat data/boxes.json \
  | jq -r \
      --arg url "$url" \
      --arg outpath $outpath \
      "$(cat data/box_labels_schema.jq)" \
  | bash
