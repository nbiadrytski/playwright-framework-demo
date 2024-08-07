import { mergeTests } from '@playwright/test';
import { clientsFixture } from './client.fixture';

export const fixtures = mergeTests(
  clientsFixture
);
