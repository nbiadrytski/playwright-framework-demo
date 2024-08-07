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

export function isKeyValuePresentInObject(
  obj: object, expectedKey: string, expectedValue: string | number | boolean | null
): boolean {
  try {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key === expectedKey) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (obj[key] === expectedValue) {
            return true;
          }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        else if (typeof obj[key] === 'object') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (isKeyValuePresentInObject(obj[key], expectedKey, expectedValue)) {
            return true;
          }
        }
      }
    }
  }
  catch (error) {
    throw new Error(`Unable to find key "${expectedKey}": "${expectedValue}" in response... ${error}`);
  }
  return false;
}

export function compareObjects(
  actualObject: any, expectedObject: any,
  keysToIgnore: string[]
): void {
  const message =
    `\nОжидаемый объект: ${JSON.stringify(expectedObject)}. 
    Фактический объект: ${JSON.stringify(actualObject)}`;

  if (Object.keys(actualObject).length !== Object.keys(expectedObject).length) {
    throw new Error(`Разное количество ключей в объектах. ${message}`);
  }

  for (const key of Object.keys(actualObject)) {
    if (keysToIgnore.includes(key)) continue;

    if (!expectedObject.hasOwnProperty.call(expectedObject, key)) {
      throw new Error(`Не найден ключ "${key}". ${message}`);
    }

    const value1 = actualObject[key];
    const value2 = expectedObject[key];
    if (typeof value1 === 'object' && value1 !== null) {
      if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) {
          throw new Error(`Разная длина списка значений для ключа "${key}". ${message}`);
        }
        for (let i = 0; i < value1.length; i++) {
          compareObjects(value1[i], value2[i], keysToIgnore);
        }
      }
      else {
        compareObjects(value1, value2, keysToIgnore);
      }
    }
    else if (value1 !== value2) {
      throw new Error(`Разные значения для ключа "${key}".
        Ожидаемое: "${value2}",
        фактическое: "${value1}". ${message}`);
    }
  }
}
