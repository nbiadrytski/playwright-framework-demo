import { test as base } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';

export type ClientsFixture = {
  authClient: AuthClient;
};

export const clientsFixture = base.extend<ClientsFixture>({
  // eslint-disable-next-line no-empty-pattern
  authClient: async ({}, use) => await use(new AuthClient()),
});
