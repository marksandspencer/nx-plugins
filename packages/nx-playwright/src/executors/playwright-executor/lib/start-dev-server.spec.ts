import { runExecutor } from '@nx/devkit';
import { startDevServer } from './start-dev-server';

async function* promiseToIterator<T extends { success: boolean }>(v: T): AsyncIterableIterator<T> {
  yield await Promise.resolve(v);
}

const runExecutorMock = jest.mocked(runExecutor);

jest.mock('@nx/devkit', () => ({
  runExecutor: jest.fn(),
  updateJson: jest.fn(),
  formatFiles: jest.fn(),
}));

describe('start dev server', () => {
  beforeEach(jest.resetAllMocks);

  it('does not start server when skipServe is true', async () => {
    const baseUrl = 'base-url';
    const result = await startDevServer(
      { skipServe: true, e2eFolder: 'folder', devServerTarget: 'http://localhost', baseUrl },
      {
        root: '',
        isVerbose: false,
        workspace: { version: 1, projects: {} },
        cwd: '',
      },
    );

    expect(runExecutorMock).not.toHaveBeenCalled();

    expect(result).toEqual(baseUrl);
  });

  it('does not start server when dev target url is missing', async () => {
    const baseUrl = 'base-url';
    const result = await startDevServer(
      { skipServe: false, e2eFolder: 'folder', baseUrl },
      {
        root: '',
        isVerbose: false,
        workspace: { version: 1, projects: {} },
        cwd: '',
      },
    );

    expect(runExecutorMock).not.toHaveBeenCalled();

    expect(result).toEqual(baseUrl);
  });

  it('returns the base url from results', async () => {
    const baseUrl = 'base-url';
    runExecutorMock.mockResolvedValue(promiseToIterator({ success: true, baseUrl }));
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

    expect(runExecutorMock).toHaveBeenCalledTimes(1);
    expect(runExecutorMock).toHaveBeenCalledWith(
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
    runExecutorMock.mockResolvedValue(promiseToIterator({ success: false }));
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
          workspace: { version: 1, projects: {} },
          cwd: '',
        },
      ),
    ).rejects.toThrowError(new Error('Could not start dev server'));
  });
});
