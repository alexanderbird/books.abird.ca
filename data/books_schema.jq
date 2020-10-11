{
  books: . | sort_by(.Category),
  categories: [ .[].Category ] | unique,
  locations: {
    Archive: "📦",
    Missing: "🤷",
    Bookshelf: "📚"
  }
}
