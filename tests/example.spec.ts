import { AuthEndpoint } from '../api/data/endpoints';
import { BaseLoginPayload } from '../api/data/objects/auth/payload/baseLogin.object';
import { BaseLoginResponse } from '../api/data/objects/auth/response/baseLogin.object';
import { CurrentAuthUserResponse } from '../api/data/objects/auth/response/currentAuthUser.object';
import { fixtures as testLogin } from '../api/fixtures/base.fixture';
import { AUTH_PASSWORD, AUTH_USERNAME } from '../common/data/constants/env';
import { compareResponses } from '../common/utils/assertionUtils';

testLogin.only(`Проверить ответ POST ${AuthEndpoint.Login}`, async ({ authClient }) => {
  const { response } = await authClient.login(
    BaseLoginPayload(
      { username: AUTH_USERNAME, password: AUTH_PASSWORD }
    )
  );
  compareResponses(
    response, BaseLoginResponse,
    ['token', 'refreshToken'],
    `POST ${AuthEndpoint.Login}`
  );

  const currentAuthUserResponse = await authClient.getCurrentAuthUser();
  compareResponses(
    currentAuthUserResponse, CurrentAuthUserResponse,
    [], `GET ${AuthEndpoint.Me}`
  );
});
