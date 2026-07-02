export const DEFAULT_BASE_URL = 'https://astroflow.wingflows.com';

/**
 * Target application base URL. Override with the BASE_URL environment variable
 * (see `.env.example`).
 */
export function getBaseUrl(): string {
  const value = process.env.BASE_URL?.trim();
  return value && value.length > 0 ? value : DEFAULT_BASE_URL;
}
