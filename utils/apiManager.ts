import { ReadStream } from 'fs';
import { ObjectSchema } from 'yup';
import { APIRequestContext, APIResponse, request, test } from '@playwright/test';
import { logRequestResponse } from './apiLogger';
import { getServiceUrl } from './envUrls';
import { SERVICE_NAME } from '../data/enums/appName';
import { checkStatusCode, validateResponseSchema } from './apiAssertions';
import { requestUrl } from './apiUtils';

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  PUT = 'PUT'
}

export interface RequestParams {
  serviceName?: SERVICE_NAME;
  endpoint?: string;
  options: {
    method?: HTTP_METHOD;
    /**
     * Allows to set post data of the request. If the data parameter is an object, it will be serialized to json string
     * and `content-type` header will be set to `application/json` if not explicitly set. Otherwise the `content-type`
     * header will be set to `application/octet-stream` if not explicitly set.
     */
    data?: any;

    /**
     * Whether to throw on response codes other than 2xx and 3xx. By default response object is returned for all status
     * codes.
     */
    failOnStatusCode?: boolean;

    /**
     * Provides an object that will be serialized as html form using `application/x-www-form-urlencoded` encoding and sent
     * as this request body. If this parameter is specified `content-type` header will be set to
     * `application/x-www-form-urlencoded` unless explicitly provided.
     */
    form?: { [key: string]: string | number | boolean };

    /**
     * Allows to set HTTP headers. These headers will apply to the fetched request as well as any redirects initiated by
     * it.
     */
    headers?: { [key: string]: string };

    /**
     * Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
     */
    ignoreHTTPSErrors?: boolean;

    /**
     * Maximum number of request redirects that will be followed automatically. An error will be thrown if the number is
     * exceeded. Defaults to `20`. Pass `0` to not follow redirects.
     */
    maxRedirects?: number;

    /**
     * Provides an object that will be serialized as html form using `multipart/form-data` encoding and sent as this
     * request body. If this parameter is specified `content-type` header will be set to `multipart/form-data` unless
     * explicitly provided. File values can be passed either as
     * [`fs.ReadStream`](https://nodejs.org/api/fs.html#fs_class_fs_readstream) or as file-like object containing file
     * name, mime-type and its content.
     */
    multipart?: { [key: string]: string | number | boolean | ReadStream | {
      /**
         * File name
         */
      name: string;

      /**
         * File type
         */
      mimeType: string;

      /**
       * File content
       */
      buffer: Buffer;
    }; };

    /**
     * Query parameters to be sent with the URL.
     */
    params?: { [key: string]: string | number | boolean };

    /**
     * Request timeout in milliseconds. Defaults to `30000` (30 seconds). Pass `0` to disable timeout.
     */
    timeout?: number;
  };
};

export interface ResponseAssertParams {
  statusCode: number;
  schema?: ObjectSchema<any>;
}

export const API_REQUEST_TIMEOUT = 30000;

export class ApiManager {
  async send(
    method: HTTP_METHOD,
    requestParams: RequestParams,
    responseAssertParams: ResponseAssertParams
  ): Promise<APIResponse> {
    return test.step(this.getStepName(requestParams), async () => {
      requestParams.options.method = method;

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
