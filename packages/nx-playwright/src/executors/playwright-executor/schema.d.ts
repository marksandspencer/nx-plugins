export interface PlaywrightExecutorSchema {
  e2eFolder: string;
  devServerTarget?: string;
  baseUrl?: string;
  slowMo?: number;
  devtools?: boolean;
  headless?: boolean;
  browsers?: ('chromium' | 'firefox' | 'webkit')[];
  timeout?: number;
  skipServe?: boolean;
}
