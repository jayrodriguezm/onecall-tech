import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { QuoteFormPage } from '../pages/QuoteFormPage';


test.describe('Request a Quote', () => {
  test('should navigate to the RFQ form, fill all required fields, submit, and assert the success message', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const quoteFormPage = new QuoteFormPage(page);

    // ── Step 1: Navigate to the homepage ──────────────────────────────────
    await homePage.open();

    // ── Step 2: Click "Request a Quote" ──────────────────────────────────
    await homePage.clickRequestAQuote();
    await expect(page).toHaveURL(/\/rfq/);

    // ── Step 3: Fill the form ─────────────────────────────────────────────

    // Contact information
    await quoteFormPage.fillContactInfo({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
    });

    // Company information
    await quoteFormPage.fillCompanyInfo({
      company: 'Acme Logistics Inc.',
      industry: 'Technology & Electronics',
    });

    // Service requirements
    await quoteFormPage.fillServiceRequirements({
      services: ['warehousing', 'transportation'],
      timeline: '1-3 months',
      details:
        'We need warehousing and transportation services for our growing e-commerce operation. ' +
        'Estimated 500 pallets of inventory with daily outbound shipments.',
    });

    // ── Step 4: Submit and assert the success dialog ───────────────────────
    await Promise.all([
      page.waitForEvent('dialog').then(async (dialog) => {
        expect(dialog.message()).toContain('Thank you for your request!');
        await dialog.accept();
      }),
      quoteFormPage.submitForm(),
    ]);
  });
});
