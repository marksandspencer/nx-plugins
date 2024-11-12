import { Linter } from '@nx/eslint';
import type { PackageRunner } from '../../types';

export interface NxPlaywrightGeneratorSchema {
  project?: string;
  name: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  skipFormat?: boolean;
  packageRunner?: PackageRunner;
  includeAxe?: boolean;
}
