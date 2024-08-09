import { mergeTests } from '@playwright/test';
import { clientsFixture } from './clients.fixture';
import { tokenFixture } from './auth/token.fixture';

export const fixtures = mergeTests(
  clientsFixture,
  tokenFixture
);
