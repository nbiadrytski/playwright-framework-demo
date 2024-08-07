import { APIResponse, test } from '@playwright/test';
import { API_REQUEST_TIMEOUT, ApiManager, HTTP_METHOD, RequestParams, ResponseAssertParams } from '../utils/apiManager';
import { deepMergeObjects } from '../utils/objectUtils';

export class BaseClient {
  protected readonly apiManager: ApiManager;
  protected requestParams: RequestParams;

  constructor() {
    this.apiManager = new ApiManager();
    this.requestParams = { options: { timeout: API_REQUEST_TIMEOUT } };
  }

  protected async sendClientRequest(
    stepName: string,
    httpMethod: HTTP_METHOD,
    responseAssertParams: ResponseAssertParams,
    customRequestParams?: RequestParams,
    customResponseAssertParams?: ResponseAssertParams
  ): Promise<APIResponse> {
    return await test.step(stepName, async () => {
      console.log(stepName);
      let response: APIResponse;
      /*
      Для тестов с негативными проверками.
      customRequestParams позволяет создавать свои параметры запроса:
      заголовки, тело запроса, конечную точку и остальные атрибуты из RequestParams.
      customResponseParams позволяют указать ожидаемый статус запроса и схему ответа для валидации
       */
      if (customRequestParams && customResponseAssertParams) {
        response = await this.apiManager.send(
          httpMethod,
          deepMergeObjects(this.requestParams, customRequestParams),
          {
            schema: customResponseAssertParams?.schema,
            statusCode: customResponseAssertParams?.statusCode,
          }
        );
      }
      else if (customRequestParams) {
        response = await this.apiManager.send(
          httpMethod,
          deepMergeObjects(this.requestParams, customRequestParams),
          responseAssertParams
        );
      }
      else {
        response = await this.apiManager.send(
          httpMethod, this.requestParams, responseAssertParams);
      }
      return response;
    });
  }

  protected updateRequestParams(
    endpoint: string,
    headers?: any,
    payload?: any,
    queryParams?: { [key: string]: string | number | boolean }
  ): RequestParams {
    this.requestParams.endpoint = endpoint;
    if (headers) this.requestParams.options.headers = headers;
    if (payload) this.requestParams.options.data = payload;
    if (queryParams) this.requestParams.options.params = queryParams;
    return this.requestParams;
  }
}
