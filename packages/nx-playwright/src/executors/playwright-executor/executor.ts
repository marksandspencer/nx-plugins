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
  const TEAMS_WEBHOOK="https://mnscorp.webhook.office.com/webhookb2/64e209ff-e52d-45c9-9223-153db5765718@bd5c6713-7399-4b31-be79-78f2d078e543/IncomingWebhook/48dbd7596cb94192b94cbad39f4ffb4b/9f90c474-7541-4f38-a971-d6cec0ca63be"
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
