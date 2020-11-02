. as $root | .boxes | to_entries | .[] | . as $box | 
  $box.value * {
    id: $box.key,
    path: ("/#location=Archive%3Bcategory=" + ($root.boxCategories | to_entries | [ .[] | select(.value == $box.key) | .key ] | join(","))),
    qrCodeFileName: ("box-" + $box.key + ".png")
    
  }
| "echo 'generating QR code " + .qrCodeFileName + "' && qrencode -o " + $outpath + "/" + .qrCodeFileName + " " + $url + .path 
