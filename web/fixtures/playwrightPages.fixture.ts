import { Fixtures } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/playwrightHome.page';
import { PlaywrightLanguagesPage } from '../pages/playwrightLanguages.page';
import { ContextPagesFixture } from './contextPages.fixture';

export type PlaywrightPagesFixture = {
  playwrightHomePage: PlaywrightHomePage;
  playwrightLanguagesPage: PlaywrightLanguagesPage;
};

export const playwrightPagesFixture: Fixtures<PlaywrightPagesFixture, ContextPagesFixture> = {
  playwrightHomePage: async ({ contextPage }, use) => {
    const playwrightHomePage = new PlaywrightHomePage(contextPage);

    await use(playwrightHomePage);
  },
  playwrightLanguagesPage: async ({ contextPage }, use) => {
    const playwrightLanguagesPage = new PlaywrightLanguagesPage(contextPage);

    await use(playwrightLanguagesPage);
  },
};
