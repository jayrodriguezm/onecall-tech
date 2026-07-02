import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuoteFormPage } from '../pages/QuoteFormPage';

type PageFixtures = {
  homePage: HomePage;
  quoteFormPage: QuoteFormPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  quoteFormPage: async ({ page }, use) => {
    await use(new QuoteFormPage(page));
  },
});

export { expect };
