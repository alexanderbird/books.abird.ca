import * as filter from './filter';

export function hashChange() {
  filter.updateFromUrlHash();
}
