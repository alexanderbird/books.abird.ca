export function simplify(parsed) {
  switch (parsed.type) {
    case 'and':
      return `and(${parsed.value.map(simplify).join(' ')})`;
    case 'or': 
      return `or(${parsed.value.map(simplify).join(' ')})`;
    case 'not':
      return `not(${simplify(parsed.value)})`;
    case 'search':
      return parsed.value;
    case 'scoped':
      return `{${parsed.value.scope}=${parsed.value.search}}`;
    default:
      return JSON.stringify(parsed);
  }
}
