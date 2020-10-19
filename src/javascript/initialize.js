document.addEventListener('DOMContentLoaded', () => {
  filter.updateFromUrlHash();
  filter.initialize();
  search.initialize();
});

window.addEventListener('hashchange', function() {
  filter.updateFromUrlHash();
}, false);

