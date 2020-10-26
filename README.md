## Dev Setup

    npm install
    brew install qrencode


## Editing the books.csv file

If you open it in Excel, Excel is "smart" enough to notice the first column
looks like numbers, so it discards all the "irrelevant" leading zeroes and
breaks everything. So, instead you must open a blank worksheet in Excel and
import `data/books.csv`.

 - Select Origin "UTF-8"
 - Select Delimited > Comma
 - Mark the first column as Text (*not* number)

When you save, you can save as .csv to replace the original.


## Overriding Thumbnails

If the google books results don't give the right thumbnail, you can override it
by committing the thumbnail to git in the ./data/thumbnails directory. The file
path should be the isbn with no file extension.

The image must be 192 pixels tall. You may find this imagemagick resize command
helpful:

    isbn="1234567890"
    convert ~/Downloads/$isbn.jpg -resize x192 data/thumbnails/$isbn

## Loading new books

To pre-populate the csv & thumbnail, run `npm run search -- <isbn>`.

This will generate an html summary of the search results and open it.

Click on the tile that looks right. This copies some bash to your clipboard.

Paste that bash into a terminal in the project root directory to download the
thumbnail and put the isbn/title/author at the end of the csv file.

### Updating the color map

When you're done a batch, re-run `npm run generate-color-map` to update
colors.json

### Updating box labels

If you edit `src/box_labels.books.json`, re-run `npm run generate-qr-codes` to
update the QR codes to match the new box list.

## CI setup

Use `npm run ci-build` to build everything except the Nearley grammar for
parsing search. That's committed to git so it's optional to build it.
