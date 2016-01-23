export function typeOf( obj ) {
  if (typeof obj === 'string' || obj instanceof String) {
    return 'string';
  }

  if (obj instanceof RegExp) {
    return 'regexp';
  }

  return typeof obj;
}
