import { test as base } from '@playwright/test';
import { ContextPagesFixture, contextPagesFixture } from '../fixtures/contextPages.fixture';
import { PlaywrightPagesFixture, playwrightPagesFixture } from '../fixtures/playwrightPages.fixture';
import { combineFixtures } from '../utils/fixtures';

export const searchTest = base.extend<ContextPagesFixture, PlaywrightPagesFixture>(
  combineFixtures(
    contextPagesFixture,
    playwrightPagesFixture
  )
);
