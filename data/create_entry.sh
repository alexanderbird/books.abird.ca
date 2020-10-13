isbn=$1
[[ "$isbn" == "" ]] && { echo "Missing ISBN parameter"; exit 1; }
title=$2
[[ "$title" == "" ]] && { echo "Missing Title parameter"; exit 1; }
author=$3
[[ "$author" == "" ]] && { echo "Missing Author parameter"; exit 1; }
location=$4
[[ "$location" == "" ]] && { echo "Missing Location parameter"; exit 1; }
category=$5
[[ "$category" == "" ]] && { echo "Missing Category parameter"; exit 1; }
google_id=$6
[[ "$google_id" == "" ]] && { echo "Missing Google ID parameter"; exit 1; }
thumbnail=$7
[[ "$thumbnail" == "" ]] && { echo "Missing Thumbnail URL parameter"; exit 1; }


curl "${thumbnail}" > data/thumbnails/${isbn}
convert data/thumbnails/${isbn} -resize x192 data/thumbnails/${isbn}
./data/generate_missing_colors.sh

# fix line ending in CSV
ed -s data/books.csv <<< w
echo -E "${isbn},\"${title}\",\"${author}\",${location},${category},,${google_id}" >> data/books.csv

