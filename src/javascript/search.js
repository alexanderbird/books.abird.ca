const search = (function() {
  class Book {
    constructor(book) {
      this.element = book;
      this.lowerCaseText = book.textContent.toLowerCase();
    }

    getDataSetEntry(key) {
      return this.element.dataset[key.toLowerCase()] || '';
    }
  }

  function showAndHideBooks(search) {
    const searchExpression = searchLanguage.parse(search);
    Array.from(document.querySelectorAll('.book'))
      .map(book => new Book(book))
      .forEach(book => {
        const showBook = searchExpression.matches(book);
        const hideBook = !showBook;
        book.element.style.setProperty('--hidden-by-search', hideBook ? 'none' : 'unset');
      });
  }

  function initializeSearchInput() {
    const searchInput = document.querySelector('.search');
    searchInput.value = document.body.dataset.search || '';
    searchInput.addEventListener('keyup', () => {
      const search = searchInput.value.trim();
      showAndHideBooks(search);
      document.body.dataset.search = search;
      window.location.hash = '#' + state.serializeBodyDataset(document.body.dataset);
    });

    showAndHideBooks(searchInput.value.trim());
  }

  return {
    initialize: initializeSearchInput
  }
}());
