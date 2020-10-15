function filterBooks(category) {
  const categoryInput = document.querySelector(`#category-${category}`);
  if (categoryInput) {
    categoryInput.checked = true;
  } else {
    document.querySelector('#category-_all').checked = true;
  }
}

function updateFilterFromUrlHash() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    filterBooks(hash);
  }
}

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
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachClickEvents();
  updateFilterFromUrlHash();
});

window.addEventListener('hashchange', function() {
  updateFilterFromUrlHash();
}, false);
