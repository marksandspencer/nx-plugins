export interface PlaywrightExecutorSchema {
  e2eFolder: string;
  devServerTarget?: string;
  baseUrl?: string;
  slowMo?: number;
  devtools?: boolean;
  headed?: boolean;
  reporter?: string;
  browser?: 'chromium' | 'firefox' | 'webkit' | 'all';
  runner?: 'yarn' | 'npx' | 'pnpm';
  timeout?: number;
  skipServe?: boolean;
}
