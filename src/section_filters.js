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

document.addEventListener('DOMContentLoaded', () => {
  updateFilterFromUrlHash();
});

window.addEventListener('hashchange', function() {
  updateFilterFromUrlHash();
}, false);
