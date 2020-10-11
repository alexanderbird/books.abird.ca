(. | del(.books)) * {
  books: .books | [ .[] | . * {
    Color: (($colors[.ISBN] // "#FFFFFF") + $opacity)
  } ],
}
