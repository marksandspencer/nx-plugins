import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { startDevServer } from './lib/start-dev-server';
import executorSchema from './schema.json';
import { PlaywrightExecutorSchema } from './schema-types';

function getFlags({
  debug,
  headed,
  passWithNoTests,
  browser,
  testProject,
  reporter,
  timeout,
  grep,
  grepInvert,
}: PlaywrightExecutorSchema) {
  const headedOption = headed === true ? '--headed' : '';
  const passWithNoTestsOption = passWithNoTests === true ? '--pass-with-no-tests' : '';
  const browserOption = browser?.length ? `--browser=${browser}` : '';
  const projectOption = testProject?.length ? `--project=${testProject}` : '';
  const reporterOption = reporter?.length ? `--reporter=${reporter}` : '';
  const timeoutOption = timeout !== undefined ? `--timeout=${timeout}` : '';
  const grepOption = grep !== undefined ? `--grep=${grep}` : '';
  const grepInvertOption = grepInvert !== undefined ? `--grep-invert=${grepInvert}` : '';
  const debugOption = debug !== undefined && debug ? '--debug' : '';

  return [
    headedOption,
    projectOption,
    browserOption,
    reporterOption,
    timeoutOption,
    grepOption,
    grepInvertOption,
    passWithNoTestsOption,
    debugOption,
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
