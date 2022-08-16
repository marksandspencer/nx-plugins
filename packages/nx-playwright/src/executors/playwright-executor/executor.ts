import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { startDevServer } from './lib/start-dev-server';
import { PlaywrightExecutorSchema } from './schema';

export default async function executor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext,
) {
  await startDevServer(options, context);

  const success = await Promise.resolve()
    .then(async () => {
      let headedOption = ""
      if (options.headed === true) {
          headedOption = "--headed"
      }
      let projectOption = ""
      if (options.browser?.length) {
          projectOption = `--browser=${options.browser}`
      }
      let reporterOption = ""
      if (options.reporter?.length) {
          reporterOption = `--reporter=${options.reporter}`
      }
      
      const { stdout, stderr } = await promisify(exec)(
        `yarn playwright test src --config ${options.e2eFolder}/playwright.config.ts ${headedOption} ${projectOption} ${reporterOption}`
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
