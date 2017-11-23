export function deepRemoveFields(object: object, removingKeys: string[]) {
  Object.keys(object).forEach((key) => {
    if (removingKeys.indexOf(key) >= 0) {
      delete object[key];
    } else if (object[key] !== null && typeof object[key] === 'object') {
      deepRemoveFields(object[key], removingKeys);
    }
  });

  return object;
}
