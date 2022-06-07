import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { startDevServer } from './lib/start-dev-server';
import { PlaywrightExecutorSchema } from './schema';

export default async function executor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext,
) {
  let success: boolean;
  await startDevServer(options, context);
  try {
    const { stdout, stderr } = await promisify(exec)(
      `yarn playwright test src --config ${options.e2eFolder}/playwright.config.ts`,
    );

    console.info(`Playwright output ${stdout}`);
    if (stderr) {
      console.error(`Playwright errors ${stderr}`);
    }

    success = stdout.includes('passed');
  } catch (e) {
    console.error('Unexpected error', e.message);
    success = false;
  }

  return { success };
}
