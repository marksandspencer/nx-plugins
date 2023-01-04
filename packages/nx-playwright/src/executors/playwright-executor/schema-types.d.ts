import type { PackageRunner } from '../../types';

export interface PlaywrightExecutorSchema {
  e2eFolder: string;
  devServerTarget?: string;
  baseUrl?: string;
  slowMo?: number;
  devtools?: boolean;
  headed?: boolean;
  reporter?: string;
  browser?: 'chromium' | 'firefox' | 'webkit' | 'all';
  environmentVariables?: object;
  packageRunner?: PackageRunner;
  timeout?: number;
  skipServe?: boolean;
  grep?: string;
  grepInvert?: string;
  passWithNoTests?: boolean;
}
