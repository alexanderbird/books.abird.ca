function listify(key, value) {
  return key === 'search' ? value : value.replace(/ /g, ',');
}
export function serializeBodyDataset(dataset) {
  return encodeURIComponent(Object.entries(document.body.dataset)
    .map(([ key, value ]) => `${key}=${value && listify(key, value)}`)
    .join(';'));
}
