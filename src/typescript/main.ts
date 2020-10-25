import { domContentLoaded } from './domContentLoaded';
import { hashChange } from './hashChange';

document.addEventListener('DOMContentLoaded', domContentLoaded);
window.addEventListener('hashchange', hashChange, false);
