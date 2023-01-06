export interface InitGeneratorSchema {
  skipFormat?: boolean;
  packageRunner?: 'npm' | 'yarn' | 'pnpm';
}
