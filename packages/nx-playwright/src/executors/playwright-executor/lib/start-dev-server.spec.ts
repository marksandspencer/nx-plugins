import * as devkitModule from '@nrwl/devkit';
import { startDevServer } from './start-dev-server';

const runExecutor = jest.spyOn(devkitModule, 'runExecutor').mockResolvedValue(undefined);

describe('start dev server', () => {
  beforeEach(jest.resetAllMocks);

  it('does not start server when skip serve is true', async () => {
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

  it('does not start server when deb target url is missing', async () => {
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
});
