import * as state from './state';
import { parse, Expression } from './searchLanguage';
import { Book } from './book';

function showAndHideBooks(searchExpression: Expression) {
  (document.querySelector('.search-summary') as any as HTMLElement).innerHTML = searchExpression.toHtml();
  Array.from(document.querySelectorAll('.book'))
    .map(book => new Book(book))
    .forEach(book => {
      const showBook = searchExpression.matches(book);
      const hideBook = !showBook;
      book.element.style.setProperty('--hidden-by-search', hideBook ? 'none' : 'unset');
    });
}

function initializeSearchInput() {
  let lastGoodSearch = { expression: parse(''), text: '' };
  const searchInput = document.querySelector('.search') as HTMLInputElement;
  searchInput.value = document.body.dataset.search || '';
  searchInput.addEventListener('keyup', () => {
    const search = searchInput.value.trim();
    const expression = tryParse(search);
    if (expression) {
      lastGoodSearch = { expression, text: search };
      searchInput.dataset.isValid = 'yes';
    } else {
      searchInput.dataset.isValid = 'no';
    }

    showAndHideBooks(lastGoodSearch.expression);
    document.body.dataset.search = lastGoodSearch.text;
    window.location.hash = '#' + state.serializeBodyDataset(document.body.dataset);
  });

  showAndHideBooks(parse(searchInput.value.trim()));
}

function tryParse(search: string): Expression | false {
  try {
    return parse(search);
  } catch(e) {
    console.info(e.message);
    return false;
  }
}

export const initialize = initializeSearchInput;
