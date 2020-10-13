.items[] | { google_id: .id } * (.volumeInfo | {
  title: .title,
  author: .authors | join(" "),
  thumbnail: .imageLinks.smallThumbnail
})
