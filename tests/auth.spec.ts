import { AuthEndpoint } from '../data/endpoints';
import { BaseLoginPayload } from '../data/objects/auth/payload/baseLogin.object';
import { BaseLoginResponse } from '../data/objects/auth/response/baseLogin.object';
import { CurrentAuthUserResponse } from '../data/objects/auth/response/currentAuthUser.object';
import { fixtures as testLogin } from '../fixtures/base.fixture';
import { AUTH_PASSWORD, AUTH_USERNAME } from '../data/envVars';
import { compareResponses } from '../utils/assertions';

testLogin(`Проверить ответ POST ${AuthEndpoint.Login}`, async ({ authClient }) => {
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

testLogin(`Проверить ответ GET ${AuthEndpoint.Me}`, async ({
  authClient, createToken,
}) => {
  const token = await createToken(BaseLoginPayload(
    { username: AUTH_USERNAME, password: AUTH_PASSWORD }
  ));

  const currentAuthUserResponse = await authClient.getCurrentAuthUser(token);
  compareResponses(
    currentAuthUserResponse, CurrentAuthUserResponse,
    [], `GET ${AuthEndpoint.Me}`
  );
});
