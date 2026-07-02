import { Page } from '@playwright/test';
import { BasePage } from './base/BasePage';

export type QuoteContactInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type QuoteCompanyInfo = {
  company: string;
  /** Option value or visible text of the Industry <select> element. */
  industry: string;
};

export type QuoteServiceInfo = {
  /** One or more service checkbox IDs to select (e.g. 'warehousing', 'manufacturing'). */
  services: string[];
  /** Option value or visible text of the Timeline <select> element. */
  timeline: string;
  /** Optional estimated monthly volume. */
  volume?: string;
  details: string;
};

/**
 * Represents the Request for Quote (RFQ) form page at /rfq.
 *
 * Form sections
 * ─────────────
 * 1. Contact Information – firstName, lastName, email, phone
 * 2. Company Information – company, industry (select)
 * 3. Service Requirements – services (checkboxes), timeline (select),
 *                           volume (optional), details (textarea)
 */
export class QuoteFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getUrl(): string {
    return '/rfq';
  }

  // ── Contact Information ──────────────────────────────────────────────────

  private firstNameInput() {
    return this.page.getByLabel(/first name/i);
  }

  private lastNameInput() {
    return this.page.getByLabel(/last name/i);
  }

  private emailInput() {
    return this.page.getByLabel(/email address/i);
  }

  private phoneInput() {
    return this.page.getByLabel(/phone number/i);
  }

  // ── Company Information ──────────────────────────────────────────────────

  private companyNameInput() {
    return this.page.getByLabel(/company name/i);
  }

  private industrySelect() {
    return this.page.locator('#industry');
  }

  // ── Service Requirements ─────────────────────────────────────────────────

  private serviceCheckbox(serviceId: string) {
    return this.page.locator(`#${serviceId}`);
  }

  private timelineSelect() {
    return this.page.locator('#timeline');
  }

  private volumeInput() {
    return this.page.locator('#volume');
  }

  private detailsTextarea() {
    return this.page.getByLabel(/project details/i);
  }

  private submitButton() {
    return this.page.getByRole('button', { name: /submit request/i });
  }

  // ── Public fill helpers ──────────────────────────────────────────────────

  async fillContactInfo(data: QuoteContactInfo): Promise<void> {
    await this.firstNameInput().fill(data.firstName);
    await this.lastNameInput().fill(data.lastName);
    await this.emailInput().fill(data.email);
    await this.phoneInput().fill(data.phone);
  }

  async fillCompanyInfo(data: QuoteCompanyInfo): Promise<void> {
    await this.companyNameInput().fill(data.company);
    await this.industrySelect().selectOption(data.industry);
  }

  async fillServiceRequirements(data: QuoteServiceInfo): Promise<void> {
    for (const serviceId of data.services) {
      await this.serviceCheckbox(serviceId).click();
    }
    await this.timelineSelect().selectOption(data.timeline);
    if (data.volume) {
      await this.volumeInput().fill(data.volume);
    }
    await this.detailsTextarea().fill(data.details);
  }

  /**
   * Clicks "Submit Request". The form responds with a browser alert dialog
   * on success; callers should register a dialog listener before calling this.
   */
  async submitForm(): Promise<void> {
    await this.submitButton().click();
  }
}
