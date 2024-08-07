import { test } from '@playwright/test';
import { compareObjects } from './objectUtils';

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
