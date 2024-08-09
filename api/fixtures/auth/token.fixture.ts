import { clientsFixture } from '../clients.fixture';
import { LoginPayloadModel } from '../../types/auth/request/loginPayload.model';

export type TokenFixture = {
  createToken: (loginPayload: LoginPayloadModel) => Promise<string>;
};

export const tokenFixture = clientsFixture.extend<TokenFixture>({

  createToken: async ({ authClient }, use) => {
    await use(async loginPayload => {
      const { token } = await authClient.login(loginPayload);
      return token;
    });
  },
});
