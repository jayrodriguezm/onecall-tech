import { getBaseUrl } from './config/env';

const HEALTH_CHECK_TIMEOUT_MS = 15_000;

async function assertTargetSiteReachable(): Promise<void> {
  const baseUrl = getBaseUrl();
  const healthCheckUrl = new URL('/', baseUrl).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);

  try {
    let response = await fetch(healthCheckUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    // Some hosts reject HEAD; fall back to GET for the same URL.
    if (response.status === 405 || response.status === 501) {
      response = await fetch(healthCheckUrl, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    console.log(`Health check passed: ${healthCheckUrl}`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Target site unreachable at ${baseUrl}. ` +
        `Verify BASE_URL and network access before running tests. (${reason})`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export default async function globalSetup(): Promise<void> {
  await assertTargetSiteReachable();
}
