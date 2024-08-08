import { Fixtures, Page, PlaywrightTestArgs } from '@playwright/test';
import { mockStaticRecourses } from '../utils/mocks/staticMocks';

export type ContextPagesFixture = {
  contextPage: Page;
};

export const contextPagesFixture: Fixtures<ContextPagesFixture, PlaywrightTestArgs> = {
  contextPage: async ({ page }, use) => {
    await mockStaticRecourses(page);

    await use(page);
  },
};
