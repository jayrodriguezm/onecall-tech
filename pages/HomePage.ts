import { Page } from '@playwright/test';
import { BasePage } from './base/BasePage';

/**
 * Represents the AstroFlow landing page.
 * Exposes interactions available on the public homepage.
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getUrl(): string {
    return '/';
  }

  /**
   * Clicks the first "Request a Quote" call-to-action found in the hero
   * or navigation area and waits for the RFQ page to load.
   */
  async clickRequestAQuote(): Promise<void> {
    await this.page
      .getByRole('link', { name: /request a quote/i })
      .first()
      .click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
