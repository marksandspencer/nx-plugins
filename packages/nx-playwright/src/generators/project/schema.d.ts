import { Linter } from '@nrwl/linter';

export interface NxPlaywrightGeneratorSchema {
  project?: string;
  name: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  skipFormat?: boolean;
}
