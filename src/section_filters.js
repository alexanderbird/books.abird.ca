function attachClickEvents() {
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

function showAndHideBooks(search) {
  const searchExpressions = search.toLowerCase().split(' ');
  Array.from(document.querySelectorAll('.book'))
    .forEach(book => {
      const bookEntryText = book.textContent.toLowerCase();
      const showBook = searchExpressions.every(word => bookEntryText.indexOf(word) >= 0);
      const hideBook = !showBook;
      book.style.setProperty('--hidden-by-search', hideBook ? 'none' : 'unset');
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

function serializeBodyDataset(dataset) {
  return Object.entries(document.body.dataset)
    .map(([ key, value ]) => `${key}=${value.replace(/ /g, ',')}`)
    .join(';');
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

document.addEventListener('DOMContentLoaded', () => {
  updateFilterFromUrlHash();
  attachClickEvents();
  initializeSearchInput();
});

window.addEventListener('hashchange', function() {
  updateFilterFromUrlHash();
}, false);
