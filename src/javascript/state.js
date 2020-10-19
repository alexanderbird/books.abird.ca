const state = (function() {
  function serializeBodyDataset(dataset) {
    return Object.entries(document.body.dataset)
      .map(([ key, value ]) => `${key}=${value.replace(/ /g, ',')}`)
      .join(';');
  }

  return {
    serializeBodyDataset
  };
}());
