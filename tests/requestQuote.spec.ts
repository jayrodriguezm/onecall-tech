import { test, expect } from '../fixtures';
import { buildQuoteFormData } from '../utils/quoteTestData';

test.describe('Request a Quote', () => {
  test(
    'should navigate to the RFQ form, fill all required fields, submit, and assert the success message',
    { tag: ['@smoke', '@regression'] },
    async ({ page, homePage, quoteFormPage }) => {
      const formData = buildQuoteFormData();

      await homePage.open();
      await homePage.clickRequestAQuote();
      await expect(page).toHaveURL(/\/rfq/);

      await quoteFormPage.fillContactInfo(formData.contact);
      await quoteFormPage.fillCompanyInfo(formData.company);
      await quoteFormPage.fillServiceRequirements(formData.services);

      await Promise.all([
        page.waitForEvent('dialog').then(async (dialog) => {
          expect(dialog.message()).toContain('Thank you for your request!');
          await dialog.accept();
        }),
        quoteFormPage.submitForm(),
      ]);
    },
  );
});
