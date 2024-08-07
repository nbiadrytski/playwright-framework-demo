import { test } from '@playwright/test';

export async function compareResponses(
  obj1: any, obj2: any,
  keysToIgnore: string[],
  requestDescription: string,
  convertToJson = true
): Promise<void> {
  let stepName = `${requestDescription}: ожидаем равенство фактического и ожидаемого ответа`;
  if (keysToIgnore.length) {
    stepName = `${stepName} исключая проверку ключей: ${keysToIgnore}`;
  }
  await test.step(stepName, async () => {
    if (convertToJson) {
      compareObjects(await obj1.json(), obj2, keysToIgnore);
    }
    else {
      compareObjects(obj1, obj2, keysToIgnore);
    }
  });
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
