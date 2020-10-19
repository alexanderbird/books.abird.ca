const state = (function() {
  function serializeBodyDataset(dataset) {
    return Object.entries(document.body.dataset)
      .map(([ key, value ]) => `${key}=${value.replace(/ /g, ',')}`)
      .join(';');
  }

  return {
    serializeBodyDataset
  };
}());

const filter = (function(serializeBodyDataset) {
  function initializeFilterButtons() {
    Array.from(document.querySelectorAll('.filter-button')).forEach(button => {
      button.addEventListener('click', () => {
        button.dataset.filterSelected = button.dataset.filterSelected === 'yes' ? 'no' : 'yes';
        const { filterType, filterValue, filterSelected: filterSelectedString } = button.dataset;
        const filterSelected = filterSelectedString === 'yes';

        const previous = (document.body.dataset[filterType] || '').trim().split(' ');

        let next;

        if (filterSelected) {
          next = [ ...previous, filterValue];
        } else {
          next = previous.filter(x => x !== filterValue);
        }

        document.body.dataset[filterType] = next.join(' ');
        history.pushState(null, null, '#' + serializeBodyDataset(document.body.dataset));
      });
    });
  }

  function updateFilterFromUrlHash() {
    const hash = location.hash.replace(/^#/, '');
    if (!hash) {
      Array.from(document.querySelectorAll(`.filter-button`)).forEach(button => {
        button.dataset.filterSelected = 'no';
      });
      document.body.dataset.category = '';
      return;
    }
    const entries = hash.split(';');
    entries.forEach(entry => {
      const [ key, valuesString ] = entry.split('=');
      const values = valuesString.split(',');

      document.body.dataset[key] = values.join(' ');
      Array.from(document.querySelectorAll(`.filter-button[data-filter-type='${key}']`)).forEach(button => {
        const selected = values.indexOf(button.dataset.filterValue) >= 0;
        button.dataset.filterSelected = selected ? 'yes' : 'no';
      });
    });
  }

  return {
    initialize: initializeFilterButtons,
    updateFromUrlHash: updateFilterFromUrlHash
  }
}(state.serializeBodyDataset));

const searchLanguage = (function() {
  /* interface Expression {
   *   matches(book: Book): boolean;
   * }
   */

  class AndExpressionList /* implements Expression */ {
    constructor(...expressions) {
      this.expressions = expressions;
    }

    matches(book) {
      return this.expressions.every(expression => expression.matches(book));
    }
  }

  function parseSingleSearchExpression(text) {
    if (text.indexOf(':') >= 0) {
      const [scope, search] = text.split(':');
      return new ScopedSearchExpression(scope, search);
    }
    return new RegularSearchExpression(text);
  }

  class ScopedSearchExpression /* implements Expression */ {
    constructor(scope, search) {
      this.scope = scope;
      this.search = search;
    }

    matches(book) {
      const value = book.getDataSetEntry(this.scope);
      return value.toLowerCase().indexOf(this.search) >= 0;
    }
  }

  class RegularSearchExpression /* implements Expression */ {
    constructor(search) {
      this.search = search;
    }

    matches(book) {
      return book.lowerCaseText.indexOf(this.search) >= 0;
    }
  }

  class YesExpression /* implements Expression */ {
    matches() { return true; }
  }

  function parseSearchExpressionList(expressionString) {
    if (!expressionString) return new YesExpression();
    const expressions = expressionString.toLowerCase().split(' ')
      .map(expression => parseSingleSearchExpression(expression));
    return new AndExpressionList(...expressions);
  }

  return {
    parse: parseSearchExpressionList
  }
}());

const search = (function(serializeBodyDataset, parseSearchExpression) {
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
    const searchExpression = parseSearchExpression(search);
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
      window.location.hash = '#' + serializeBodyDataset(document.body.dataset);
    });

    showAndHideBooks(searchInput.value.trim());
  }

  return {
    initialize: initializeSearchInput
  }
}(state.serializeBodyDataset, searchLanguage.parse));

document.addEventListener('DOMContentLoaded', () => {
  filter.updateFromUrlHash();
  filter.initialize();
  search.initialize();
});

window.addEventListener('hashchange', function() {
  filter.updateFromUrlHash();
}, false);

