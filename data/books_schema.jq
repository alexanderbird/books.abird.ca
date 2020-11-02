{
  categories: [ .[].Category ] | unique,
  locations: {
    Archive: "📦",
    Missing: "🤷",
    Bookshelf: "📚"
  },
  books: . | sort_by(.Author) | [ .[] | . * {
    Box: (if .Location != "Archive" then null else (
      $boxes.boxCategories[.Category]
      | if . == null then null else ({ id: . } * $boxes.boxes[.]) end
    ) end),
    Color: (($colors[.ISBN] // "#FFFFFF") + $opacity)
  }],
}
