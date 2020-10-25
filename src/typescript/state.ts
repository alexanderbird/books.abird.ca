export function serializeBodyDataset(dataset) {
  return Object.entries(document.body.dataset)
    .map(([ key, value ]) => `${key}=${value && value.replace(/ /g, ',')}`)
    .join(';');
}
