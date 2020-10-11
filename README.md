
## Overriding Thumbnails

If the google books results don't give the right thumbnail, you can override it
by committing the thumbnail to git in the ./data/thumbnails directory. The file
path should be the isbn with no file extension.

The image must be 192 pixels tall. You may find this imagemagick resize command
helpful:

    isbn="1234567890"
    convert ~/Downloads/$isbn.jpg -resize x192 data/thumbnails/$isbn

## Loading new books

To pre-populate the csv & thumbnail, run `npm run generate -- <isbn>`.

This will generate an html summary of the search results and open it.

Click on the tile that looks right. This copies some bash to your clipboard.

Paste that bash into a terminal in the project root directory to download the
thumbnail and put the isbn/title/author at the end of the csv file.
