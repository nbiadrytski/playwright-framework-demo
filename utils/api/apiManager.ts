import { APIRequestContext, APIResponse, request, test } from '@playwright/test';
import { logRequestResponse } from './apiLogger';
import { getServiceUrl } from '../envUrls';
import { SERVICE_NAME } from '../../data/enums/appName';
import { checkStatusCode, validateResponseSchema } from '../assertions';
import { requestUrl } from './apiUtils';
import { HTTP_METHOD } from '../../data/enums/httpMethod.enum';
import { RequestParams } from '../../types/api/requestParams.model';
import { ResponseAssertParams } from '../../types/api/responseAssertParams.model';

export const API_REQUEST_TIMEOUT = 30000;

export class ApiManager {
  async send(
    method: HTTP_METHOD,
    requestParams: RequestParams,
    responseAssertParams: ResponseAssertParams
  ): Promise<APIResponse> {
    requestParams.options.method = method;

    return test.step(this.getStepName(requestParams), async () => {
      const context: APIRequestContext = await request.newContext({ timeout: API_REQUEST_TIMEOUT });
      const response: APIResponse = await context.fetch(
        `${getServiceUrl(requestParams.serviceName as SERVICE_NAME)}/${requestParams.endpoint}`,
        requestParams.options
      );
      await logRequestResponse(requestParams, response);

      if (responseAssertParams?.statusCode) {
        await checkStatusCode(
          response,
          method,
          responseAssertParams.statusCode);
      }
      if (responseAssertParams?.schema) {
        await validateResponseSchema(response, responseAssertParams.schema);
      }
      if (requestParams.options?.data) requestParams.options.data = {};

      return response;
    });
  }

  private getStepName(requestParams: RequestParams): string {
    let stepName = `Отправить ${requestParams.options.method} ` + requestUrl(
      requestParams.serviceName as SERVICE_NAME,
      requestParams.endpoint as string
    );
    stepName = requestParams.options.params ?
      `${stepName} с параметрами "${JSON.stringify(requestParams.options?.params)}"` :
      stepName;
    return stepName;
  }
}
