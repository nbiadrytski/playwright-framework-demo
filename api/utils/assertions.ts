import { APIResponse, expect, test } from '@playwright/test';
import { ObjectSchema, ValidationError } from 'yup';
import { HTTP_METHOD } from '../data/enums/httpMethod.enum';
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

export async function checkStatusCode(
  actualResponse: APIResponse,
  requestMethod: HTTP_METHOD,
  expectedStatusCode: number
): Promise<void> {
  await test.step(`Ожидаем статус запроса: ${expectedStatusCode}`, async () => {
    expect(actualResponse.status(),
      `Статус запроса ${requestMethod} ${actualResponse.url()} должен быть: ${expectedStatusCode}`)
      .toBe(expectedStatusCode);
  });
}

export async function validateResponseSchema(response: APIResponse, schema: ObjectSchema<any>): Promise<void> {
  if (schema) {
    await test.step('Ожидаем соответствие схемы образцу', async () => {
      try {
        const responseBody = await response.json();
        await schema.validate(responseBody);
      }
      catch (error) {
        if (error instanceof ValidationError) {
          throw new Error(`Схема ответа не соответствует образцу. ${error}`);
        }
      }
    });
  }
}
