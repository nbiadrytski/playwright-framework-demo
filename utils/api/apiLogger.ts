import { APIResponse } from '@playwright/test';
import { assignHeaders, requestUrl } from './apiUtils';
import { SERVICE_NAME } from '../../data/enums/appName';
import { RequestParams } from '../../types/api/requestParams.model';

export async function logRequestResponse(
  requestParams: RequestParams,
  response: APIResponse
): Promise<void> {
  logWithTimestamp(
    `${requestParams.options.method} ` +
    `${requestUrl(requestParams.serviceName as SERVICE_NAME, requestParams.endpoint as string)}`);

  if (requestParams?.options?.params) {
    console.log(`QUERY PARAMS: ${jsonStringifyFormatted(requestParams.options?.params)}`);
  }

  if (requestParams?.options?.data) {
    console.log(`REQUEST BODY: ${jsonStringifyFormatted(requestParams.options?.data)}`);
  }

  const requestHeaders = assignHeaders({}, response.headersArray());
  console.log(
    `REQUEST HEADERS: ${jsonStringifyFormatted({ ...requestHeaders, ...requestParams.options?.headers }
    )}`
  );

  console.log(`STATUS CODE: ${response.status()}`);

  try {
    const responseBody = await response.json();
    logWithTimestamp(`RESPONSE BODY: ${jsonStringifyFormatted(responseBody)}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error: unknown) {
    logWithTimestamp(`RESPONSE BODY: ${await response.text()}`);
  }

  console.log(`RESPONSE HEADERS: ${jsonStringifyFormatted(response.headers())}`);
  console.log('*'.repeat(60) + '\n');
}

function jsonStringifyFormatted(object: any): string {
  return JSON.stringify(object, null, 2);
}

export function logWithTimestamp(message: string): void {
  console.log('[' + new Date().toISOString().substring(11, 23) + '] -', message);
}
