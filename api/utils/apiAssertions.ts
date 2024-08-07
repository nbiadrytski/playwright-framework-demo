import { APIResponse, expect, test } from '@playwright/test';
import { HTTP_METHOD } from './apiManager';
import { ObjectSchema, ValidationError } from 'yup';

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
