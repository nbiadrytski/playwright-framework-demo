import { APIResponse } from '@playwright/test';
import { SERVICE_NAME } from '../data/enums/appName';
import { LoginPayloadModel } from '../types/auth/request/loginPayload.model';
import { BaseClient } from './base.client';
import { HTTP_METHOD } from '../utils/apiManager';
import { AuthEndpoint } from '../data/endpoints';
import { LoginSchema } from '../data/responseSchema/auth/login.schema';

export class AuthClient extends BaseClient {
  private bearerToken: string;

  constructor() {
    super();
    this.requestParams = { serviceName: SERVICE_NAME.AUTH_SERVICE, options: {} };
    this.bearerToken = '';
  }

  async login(payload: LoginPayloadModel): Promise<{ response: APIResponse; token: string }> {
    this.updateRequestParams(AuthEndpoint.Login, null, payload);
    const response = await this.sendClientRequest(
      `Залогиниться пользователем ${payload.username}`,
      HTTP_METHOD.POST,
      { statusCode: 200, schema: LoginSchema }
    );
    const token = (await response.json()).token;
    this.bearerToken = token;

    return { response, token };
  }

  async getCurrentAuthUser(token?: string): Promise<APIResponse> {
    this.updateRequestParams(
      AuthEndpoint.Me,
      { Authorization: `Bearer ${token ?? this.bearerToken}` }
    );
    return this.sendClientRequest(
      `Получить пользователя по токену`,
      HTTP_METHOD.GET,
      { statusCode: 200 }
    );
  }
}
