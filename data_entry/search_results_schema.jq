.items[].volumeInfo | {
  title: .title,
  author: .authors | join(" "),
  thumbnail: .imageLinks.smallThumbnail
} | select(.thumbnail != null)
