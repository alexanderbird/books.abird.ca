{
  books: . | sort_by(.Category),
  categories: [ .[].Category ] | unique
}
