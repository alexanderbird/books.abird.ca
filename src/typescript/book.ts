export class Book {
  public element: HTMLElement;
  private lowerCaseText: string;
  constructor(book) {
    this.element = book;
    this.lowerCaseText = book.textContent.toLowerCase();
  }

  getDataSetEntry(key) {
    return this.element.dataset[key.toLowerCase()] || '';
  }
}

