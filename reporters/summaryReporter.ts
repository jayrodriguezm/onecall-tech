import * as fs from 'fs';
import * as path from 'path';
import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

type SummaryReporterOptions = {
  outputDir?: string;
};

type TestSummary = {
  title: string;
  file: string;
  project: string;
  status: TestResult['status'];
  durationMs: number;
  retry: number;
  error?: string;
};

type RunSummary = {
  status: FullResult['status'];
  startTime: string;
  durationMs: number;
  totals: {
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    total: number;
  };
  tests: TestSummary[];
};

/**
 * Writes a JSON + Markdown execution summary after the test run completes.
 * Output: `<outputDir>/summary.json` and `<outputDir>/summary.md`
 */
class SummaryReporter implements Reporter {
  private readonly outputDir: string;
  private readonly tests: TestSummary[] = [];

  constructor(options: SummaryReporterOptions = {}) {
    this.outputDir = options.outputDir ?? 'custom-report';
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const relativeFile = path.relative(process.cwd(), test.location.file);

    this.tests.push({
      title: test.title,
      file: relativeFile,
      project: test.parent.project()?.name ?? 'unknown',
      status: result.status,
      durationMs: result.duration,
      retry: result.retry,
      error: result.error?.message ? this.stripAnsi(result.error.message) : undefined,
    });
  }

  onEnd(result: FullResult): void {
    const totals = {
      passed: this.tests.filter((t) => t.status === 'passed' && t.retry === 0).length,
      failed: this.tests.filter((t) => t.status === 'failed' || t.status === 'timedOut' || t.status === 'interrupted').length,
      skipped: this.tests.filter((t) => t.status === 'skipped').length,
      flaky: this.tests.filter((t) => t.status === 'passed' && t.retry > 0).length,
      total: this.tests.length,
    };

    const summary: RunSummary = {
      status: result.status,
      startTime: result.startTime.toISOString(),
      durationMs: result.duration,
      totals,
      tests: this.tests,
    };

    fs.mkdirSync(this.outputDir, { recursive: true });

    const jsonPath = path.join(this.outputDir, 'summary.json');
    const mdPath = path.join(this.outputDir, 'summary.md');

    fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
    fs.writeFileSync(mdPath, this.toMarkdown(summary));

    console.log(`\nCustom summary report: ${mdPath}`);
  }

  private toMarkdown(summary: RunSummary): string {
    const lines: string[] = [
      '# Test Execution Summary',
      '',
      '| Field | Value |',
      '| --- | --- |',
      `| Status | **${summary.status.toUpperCase()}** |`,
      `| Started | ${summary.startTime} |`,
      `| Duration | ${this.formatDuration(summary.durationMs)} |`,
      `| Passed | ${summary.totals.passed} |`,
      `| Failed | ${summary.totals.failed} |`,
      `| Skipped | ${summary.totals.skipped} |`,
      `| Flaky | ${summary.totals.flaky} |`,
      `| Total | ${summary.totals.total} |`,
      '',
      '## Tests',
      '',
    ];

    for (const test of summary.tests) {
      lines.push(
        `### ${this.formatStatusLabel(test)} ${test.title}`,
        '',
        `- **Project:** ${test.project}`,
        `- **File:** \`${test.file}\``,
        `- **Status:** ${test.status}`,
        `- **Duration:** ${this.formatDuration(test.durationMs)}`,
        `- **Retry:** ${test.retry}`,
      );

      if (test.error) {
        lines.push('', '**Error:**', '', '```', test.error, '```');
      }

      lines.push('');
    }

    return lines.join('\n');
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }

    return `${(ms / 1000).toFixed(1)}s`;
  }

  private formatStatusLabel(test: TestSummary): string {
    if (test.status === 'passed' && test.retry > 0) {
      return '[FLAKY]';
    }

    if (test.status === 'passed') {
      return '[PASSED]';
    }

    if (test.status === 'skipped') {
      return '[SKIPPED]';
    }

    return '[FAILED]';
  }

  private stripAnsi(text: string): string {
    return text.replace(/\x1B\[[0-9;]*m/g, '');
  }
}

export default SummaryReporter;
