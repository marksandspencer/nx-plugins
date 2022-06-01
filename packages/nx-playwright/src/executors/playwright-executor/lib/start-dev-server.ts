import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import type { PlaywrightExecutorSchema } from '../schema';

type ExecutorResult = {
  success: boolean;
  baseUrl?: string;
};

export const startDevServer = async (opts: PlaywrightExecutorSchema, context: ExecutorContext) => {
  if (opts.skipServe === true) {
    return opts.baseUrl;
  }

  if (!opts.devServerTarget) {
    return opts.baseUrl;
  }

  const [project, target, configuration] = opts.devServerTarget.split(':');

  async function unwrapAsyncIterableIteratorPromise() {
    for await (const output of await runExecutor<ExecutorResult>(
      { project, target, configuration },
      { hostname: 'localhost' }, // todo i don't think we need this, try removing it
      context,
    ))
      return output;
  }

  const result = await unwrapAsyncIterableIteratorPromise();

  if (!result.success) {
    throw new Error('Could not start dev server');
  }

  return opts.baseUrl || (result.baseUrl as string);
};
