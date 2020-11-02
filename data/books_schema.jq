{
  categories: [ .[].Category ] | unique,
  locations: {
    Archive: "📦",
    Missing: "🤷",
    Bookshelf: "📚"
  },
  books: . | sort_by(.Author) | [ .[] | . * {
    Box: (
      $boxes.boxCategories[.Category]
      | if . == null then null else ({ id: . } * $boxes.boxes[.]) end
    ),
    Color: (($colors[.ISBN] // "#FFFFFF") + $opacity)
  }],
}
