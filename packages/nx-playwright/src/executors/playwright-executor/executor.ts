import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { startDevServer } from './lib/start-dev-server';
import executorSchema from './schema.json';
import { PlaywrightExecutorSchema } from './schema-types';

function getFlags(options: PlaywrightExecutorSchema) {
  const headedOption = options.headed === true ? '--headed' : '';
  const passWithNoTestsOption = options.passWithNoTests === true ? '--pass-with-no-tests' : '';
  const browserOption = options.browser?.length ? `--browser=${options.browser}` : '';
  const reporterOption = options.reporter?.length ? `--reporter=${options.reporter}` : '';
  const timeoutOption = options.timeout !== undefined ? `--timeout=${options.timeout}` : '';
  const grepOption = options.grep !== undefined ? `--grep=${options.grep}` : '';
  const grepInvertOption =
    options.grepInvert !== undefined ? `--grep-invert=${options.grepInvert}` : '';

  return [
    headedOption,
    browserOption,
    reporterOption,
    timeoutOption,
    grepOption,
    grepInvertOption,
    passWithNoTestsOption,
  ].filter(Boolean);
}

export default async function runExecutor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext & { projectName: string },
) {
  console.log('options', options);
  await startDevServer(options, context);
  const cwd = context.workspace.projects[context.projectName].root;

  const args = getFlags(options);
  console.info(`Using args ${args}`);
  const path = options.path ?? executorSchema.properties.path.default;
  // const config = options.config ?? executorSchema.properties.config.default;

  // const { stdout, stderr } = await promisify(exec)('curl http://localhost:4200');

  // console.info(`Playwright output ${stdout}`);
  // if (stderr) {
  //   console.error(`Playwright errors ${stderr}`);
  // }

  const command = [
    'playwright',
    'test',
    path,
    '--config',
    // todo
    `/Users/andrea/code/temp/test-nx-playwright/apps/test-app-e2e/playwright.config.ts`,
  ]
    .concat(args)
    .join(' ');
  console.info(`Running ${cwd}: ${command}`);
  execSync(command, { stdio: 'inherit', cwd });
  return { success: true };
}
