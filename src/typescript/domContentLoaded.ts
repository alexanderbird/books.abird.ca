import * as filter from './filter';
import * as search from './search';

export function domContentLoaded(): void {
  console.log('Hello, TypeScript (and Babel and Webpack 🤦)');

  filter.updateFromUrlHash();
  filter.initialize();
  search.initialize();
}
