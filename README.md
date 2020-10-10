
## Overriding Thumbnails

If the google books results don't give the right thumbnail, you can override it
by committing the thumbnail to git in the ./data/thumbnails directory. The file
path should be the isbn with no file extension.

The image must be 192 pixels tall. You may find this imagemagick resize command
helpful:

    isbn="1234567890"
    convert ~/Downloads/$isbn.jpg -resize x192 data/thumbnails/$isbn
