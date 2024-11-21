import {
  GeneratorCallback,
  joinPathFragments,
  runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import { Linter, lintProjectGenerator } from '@nx/eslint';
import { NxPlaywrightGeneratorNormalizedSchema } from './normalize-options';

type EslintIgnoreFile = {
  extends: string[];
  ignorePatterns: string;
  overrides: { files: string[]; rules: Record<string, string> }[];
};

export async function addLinting(
  host: Tree,
  options: NxPlaywrightGeneratorNormalizedSchema,
): Promise<GeneratorCallback> {
  const lintTask = await lintProjectGenerator(host, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.app.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{ts,tsx,js,jsx}`],
    skipFormat: true,
  });

  console.log('*** options = ', options);

  if (options.linter === Linter.EsLint) {
    const eslintrc = joinPathFragments(options.projectRoot, '.eslintrc.json');
    const eslintconfig = joinPathFragments(options.projectRoot, 'eslint.config.js');

    console.log('*** options.projectRoot = ', host.exists(options.projectRoot));
    console.log('*** options.projectRoot = ', host.children(options.projectRoot));
    console.log('*** eslintrc = ', eslintrc);
    console.log('*** eslintconfig = ', eslintconfig);
    console.log('*** eslintrc = ', host.exists(eslintrc));
    console.log('*** eslintconfig = ', host.exists(eslintconfig));

    if (host.exists(eslintrc)) {
      updateJson(
        host,
        joinPathFragments(options.projectRoot, '.eslintrc.json'),
        (json: EslintIgnoreFile) => {
          const baseOverrides = json.overrides.map(({ files, rules }) =>
            files.includes('*.ts')
              ? { files, rules: { 'jest/no-done-callback': 'off' } }
              : { files, rules },
          );

          return {
            ...json,
            overrides: options.includeAxe
              ? [
                  ...baseOverrides,
                  {
                    files: ['**/axe-tests/axe-tests.spec.ts'],
                    rules: { 'jest/expect-expect': 'off' },
                  },
                ]
              : baseOverrides,
            extends: [...json.extends],
          };
        },
      );
    }
  }

  return runTasksInSerial(lintTask);
}
