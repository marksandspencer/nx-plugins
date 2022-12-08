import * as devkitModule from '@nrwl/devkit';
import { startDevServer } from './start-dev-server';

async function* promiseToIterator<T extends { success: boolean }>(v: T): AsyncIterableIterator<T> {
  yield await Promise.resolve(v);
}

const runExecutor = jest.spyOn(devkitModule, 'runExecutor');

describe('start dev server', () => {
  beforeEach(jest.resetAllMocks);

  it('does not start server when skipServe is true', async () => {
    const baseUrl = 'base-url';
    const result = await startDevServer(
      { skipServe: true, e2eFolder: 'folder', devServerTarget: 'http://localhost', baseUrl },
      {
        root: '',
        isVerbose: false,
        workspace: { version: 1, projects: {}, npmScope: '' },
        cwd: '',
      },
    );

    expect(runExecutor).not.toHaveBeenCalled();

    expect(result).toEqual(baseUrl);
  });

  it('does not start server when dev target url is missing', async () => {
    const baseUrl = 'base-url';
    const result = await startDevServer(
      { skipServe: false, e2eFolder: 'folder', baseUrl },
      {
        root: '',
        isVerbose: false,
        workspace: { version: 1, projects: {}, npmScope: '' },
        cwd: '',
      },
    );

    expect(runExecutor).not.toHaveBeenCalled();

    expect(result).toEqual(baseUrl);
  });

  it('returns the base url from results', async () => {
    const baseUrl = 'base-url';
    runExecutor.mockResolvedValue(promiseToIterator({ success: true, baseUrl }));
    const context = {
      root: '',
      isVerbose: false,
      workspace: { version: 1, projects: {}, npmScope: '' },
      cwd: '',
    };

    const result = await startDevServer(
      {
        skipServe: false,
        e2eFolder: 'folder',
        devServerTarget: 'project:target:configuration',
      },
      context,
    );

    expect(result).toEqual(baseUrl);

    expect(runExecutor).toHaveBeenCalledTimes(1);
    expect(runExecutor).toHaveBeenCalledWith(
      {
        project: 'project',
        target: 'target',
        configuration: 'configuration',
      },
      {},
      context,
    );
  });

  it('throws an error when executor fails', async () => {
    runExecutor.mockResolvedValue(promiseToIterator({ success: false }));
    await expect(
      startDevServer(
        {
          skipServe: false,
          e2eFolder: 'folder',
          baseUrl: 'base-url',
          devServerTarget: 'http://localhost',
        },
        {
          root: '',
          isVerbose: false,
          workspace: { version: 1, projects: {}, npmScope: '' },
          cwd: '',
        },
      ),
    ).rejects.toThrowError(new Error('Could not start dev server'));
  });
});
