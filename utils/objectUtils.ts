export function deepMergeObjects(target: any, ...sources: any[]) {
  for (const source of sources) {
    for (const key in source) {
      const sourceValue = source[key], targetValue = target[key];
      if (Object(sourceValue) == sourceValue && Object(targetValue) === targetValue) {
        target[key] = deepMergeObjects(targetValue, sourceValue);
        continue;
      }
      target[key] = source[key];
    }
  }
  return target;
}
