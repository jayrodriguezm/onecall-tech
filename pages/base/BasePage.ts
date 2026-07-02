import { Page } from '@playwright/test';

/**
 * BasePage provides shared browser interaction utilities and enforces
 * a common navigation contract for all page objects.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Returns the absolute or relative URL for this page.
   */
  abstract getUrl(): string;

  /**
   * Navigates directly to this page and waits for the DOM to be ready.
   */
  async open(): Promise<void> {
    await this.page.goto(this.getUrl(), { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits until there is no outstanding network activity, useful after
   * submitting forms or triggering lazy-loaded content.
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
