url="$1"
outpath="$2"

[[ "$url" == "" ]] && { echo "Missing URL parameter"; exit 1; }
[[ "$outpath" == "" ]] && { echo "Missing output path parameter"; exit 1; }

rm -r "./$outpath" || :
mkdir -p "./$outpath"

cat src/box_labels/boxes.json \
  | jq -r \
      --arg url "$url" \
      --arg outpath $outpath \
      ".boxes[] | \"echo 'generating QR code \" + .slug + \"' && qrencode -o \" + \$outpath + \"/\" + .slug + \".png \\\"\" + \$url + \"#\" + .path + \"\\\"\"" \
  | bash
