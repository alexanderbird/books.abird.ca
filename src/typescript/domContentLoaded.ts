import * as filter from './filter';
import * as search from './search';

export function domContentLoaded(): void {
  filter.updateFromUrlHash();
  filter.initialize();
  search.initialize();
}
