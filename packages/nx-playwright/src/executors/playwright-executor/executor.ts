import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { startDevServer } from './lib/start-dev-server';
import { PlaywrightExecutorSchema } from './schema';

function getFlags(options: PlaywrightExecutorSchema): string {
  const headedOption = options.headed === true ? '--headed' : '';
  const browserOption = options.browser?.length ? `--browser=${options.browser}` : '';
  const reporterOption = options.reporter?.length ? `--reporter=${options.reporter}` : '';
  const timeoutOution = options.timeout !== undefined ? `--timeout=${options.timeout}` : '';

  const flagStrings = [headedOption, browserOption, reporterOption, timeoutOution].filter(Boolean);

  return flagStrings.join(' ');
}

export default async function executor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext,
) {
  await startDevServer(options, context);

  const success = await Promise.resolve()
    .then(async () => {
      const flags = getFlags(options);
      const runnerCommand = options.runner ?? 'yarn';

      const { stdout, stderr } = await promisify(exec)(
        `${runnerCommand} playwright test src --config ${options.e2eFolder}/playwright.config.ts ${flags}`.trim(),
      );

      console.info(`Playwright output ${stdout}`);
      if (stderr) {
        console.error(`Playwright errors ${stderr}`);
      }

      return stdout.includes('passed');
    })
    .catch((error) => {
      console.error('Unexpected error', error);
      return false;
    });

  return { success };
}
