import * as state from './state';

function initializeFilterButtons() {
  (Array.from(document.querySelectorAll('.filter-button')) as any[] as HTMLElement[]).forEach((button: HTMLElement) => {
    button.addEventListener('click', () => {
      button.dataset.filterSelected = button.dataset.filterSelected === 'yes' ? 'no' : 'yes';
      const { filterType, filterValue, filterSelected: filterSelectedString } = button.dataset;
      const filterSelected = filterSelectedString === 'yes';

      const previous = (document.body.dataset[filterType || ''] || '').trim().split(' ');

      let next;

      if (filterSelected) {
        next = [ ...previous, filterValue];
      } else {
        next = previous.filter(x => x !== filterValue);
      }

      document.body.dataset[filterType || ''] = next.join(' ');
      history.pushState(null, null as any as string, '#' + state.serializeBodyDataset(document.body.dataset));
    });
  });
}

function updateFilterFromUrlHash() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!hash) {
    (Array.from(document.querySelectorAll(`.filter-button`)) as any[] as HTMLElement[])
      .forEach((button: HTMLElement) => {
        button.dataset.filterSelected = 'no';
      });
    document.body.dataset.category = '';
    return;
  }
  const entries = hash.split(';');
  entries.forEach(entry => {
    const [ key, valuesString ] = entry.split('=');
    if (key === 'search') {
      document.body.dataset[key] = valuesString;
      return;
    }
    const values = valuesString.split(',');

    document.body.dataset[key] = values.join(' ');
    (Array.from(document.querySelectorAll(`.filter-button[data-filter-type='${key}']`)) as any[] as HTMLElement[])
      .forEach((button: HTMLElement) => {
        const selected = values.indexOf(button.dataset.filterValue || '') >= 0;
        button.dataset.filterSelected = selected ? 'yes' : 'no';
      });
  });
}

export const initialize = initializeFilterButtons;
export const updateFromUrlHash = updateFilterFromUrlHash;
