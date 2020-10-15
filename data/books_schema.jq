{
  books: . | sort_by(.Author),
  categories: [ .[].Category ] | unique,
  locations: {
    Archive: "📦",
    Missing: "🤷",
    Bookshelf: "📚"
  }
}
