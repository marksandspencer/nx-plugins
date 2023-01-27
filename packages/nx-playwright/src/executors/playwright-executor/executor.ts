import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { startDevServer } from './lib/start-dev-server';
import executorSchema from './schema.json';
import { PlaywrightExecutorSchema } from './schema-types';

function getFlags(options: PlaywrightExecutorSchema) {
  const headedOption = options.headed === true ? '--headed' : '';
  const passWithNoTestsOption = options.passWithNoTests === true ? '--pass-with-no-tests' : '';
  const browserOption = options.browser?.length ? `--browser=${options.browser}` : '';
  const projectOption = options.testProject?.length ? `--project=${options.testProject}` : '';
  const reporterOption = options.reporter?.length ? `--reporter=${options.reporter}` : '';
  const timeoutOption = options.timeout !== undefined ? `--timeout=${options.timeout}` : '';
  const grepOption = options.grep !== undefined ? `--grep=${options.grep}` : '';
  const grepInvertOption =
    options.grepInvert !== undefined ? `--grep-invert=${options.grepInvert}` : '';

  return [
    headedOption,
    projectOption,
    browserOption,
    reporterOption,
    timeoutOption,
    grepOption,
    grepInvertOption,
    passWithNoTestsOption,
  ];
}

export default async function runExecutor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext,
) {
  await startDevServer(options, context);

  const flags = getFlags(options);

  const path = options.path ?? executorSchema.properties.path.default;
  const config = options.config ?? executorSchema.properties.config.default;
  const runner = options.packageRunner ?? '';
  const args = [
    runner,
    'playwright',
    'test',
    path,
    `--config ${options.e2eFolder}/${config}`,
    ...flags,
  ]
    .filter(Boolean)
    .join(' ');

  await new Promise((resolve, reject) => {
    exec(args, null, (error, stdout, stderr) => {
      error ? reject(error) : resolve({ stdout, stderr });
    }).stdout.pipe(process.stdout);
  });

  return { success: true };
}
