import type { QuoteCompanyInfo, QuoteContactInfo, QuoteServiceInfo } from '../pages/QuoteFormPage';

export type QuoteFormData = {
  contact: QuoteContactInfo;
  company: QuoteCompanyInfo;
  services: QuoteServiceInfo;
};

const defaultQuoteFormData: QuoteFormData = {
  contact: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
  },
  company: {
    company: 'Acme Logistics Inc.',
    industry: 'Technology & Electronics',
  },
  services: {
    services: ['warehousing', 'transportation'],
    timeline: '1-3 months',
    details:
      'We need warehousing and transportation services for our growing e-commerce operation. ' +
      'Estimated 500 pallets of inventory with daily outbound shipments.',
  },
};

/**
 * Returns RFQ form test data. Pass partial overrides to customize fields per test.
 */
export function buildQuoteFormData(overrides: Partial<QuoteFormData> = {}): QuoteFormData {
  return {
    contact: { ...defaultQuoteFormData.contact, ...overrides.contact },
    company: { ...defaultQuoteFormData.company, ...overrides.company },
    services: { ...defaultQuoteFormData.services, ...overrides.services },
  };
}
