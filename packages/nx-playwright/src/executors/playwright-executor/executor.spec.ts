import { ExecutorContext } from '@nx/devkit';
import { exec } from 'child_process';
import executor from './executor';
import * as startDevServerModule from './lib/start-dev-server';
import { PlaywrightExecutorSchema } from './schema-types';

jest.mock('child_process');

const execMock = jest.mocked(exec);

const startDevServer = jest
  .spyOn(startDevServerModule, 'startDevServer')
  .mockResolvedValueOnce(undefined);

const context = {
  root: '',
  isVerbose: false,
  workspace: { version: 1, projects: {}, npmScope: '' },
  cwd: '',
} as unknown as ExecutorContext;

console.error = jest.fn().mockReturnValue(null);
console.info = jest.fn().mockReturnValue(null);
console.debug = jest.fn().mockReturnValue(null);

describe('executor', () => {
  beforeEach(jest.resetAllMocks);

  it('uses correct runner and path and config', async () => {
    const options: PlaywrightExecutorSchema = {
      e2eFolder: 'folder',
      path: 'src/tests',
      config: 'config/playwright.config.ts',
    };

    const pipe = jest.fn();

    execMock.mockImplementation((_command, _options, callback) => {
      callback(null, 'passed', '');
      return { stdout: { pipe } } as unknown as ReturnType<typeof execMock>;
    });

    await executor(options, context);

    const expected = 'playwright test src/tests --config folder/config/playwright.config.ts';
    expect(execMock).toHaveBeenCalledWith(expected, null, expect.any(Function));
    expect(pipe).toHaveBeenCalledTimes(1);
  });

  it('runs with optional package runner', async () => {
    const options: PlaywrightExecutorSchema = {
      e2eFolder: 'folder',
      packageRunner: 'npx',
    };

    const pipe = jest.fn();

    execMock.mockImplementation((_command, _options, callback) => {
      callback(null, 'passed', '');
      return { stdout: { pipe } } as unknown as ReturnType<typeof execMock>;
    });

    await executor(options, context);

    const expected = 'npx playwright test src --config folder/playwright.config.ts';
    expect(execMock).toHaveBeenCalledWith(expected, null, expect.any(Function));
  });

  it.each<[string, PlaywrightExecutorSchema]>([
    [
      '--headed --browser=firefox --reporter=html --timeout=1234 --grep=@tag1',
      {
        e2eFolder: 'folder',
        headed: true,
        browser: 'firefox',
        reporter: 'html',
        timeout: 1234,
        grep: '@tag1',
      },
    ],
    [
      '--headed --project=demo',
      {
        e2eFolder: 'folder',
        headed: true,
        testProject: 'demo',
      },
    ],
    [
      '--shard=2/4',
      {
        e2eFolder: 'folder',
        shard: '2/4',
      },
    ],
    [
      '--grep-invert=@tag1',
      {
        e2eFolder: 'folder',
        grepInvert: '@tag1',
      },
    ],
    [
      '--pass-with-no-tests',
      {
        passWithNoTests: true,
        e2eFolder: 'folder',
      },
    ],
    [
      '--debug',
      {
        debug: true,
        e2eFolder: 'folder',
      },
    ],
    [
      '--update-snapshots',
      {
        updateSnapshots: true,
        e2eFolder: 'folder',
      },
    ],
    [
      '--ui',
      {
        ui: true,
        e2eFolder: 'folder',
      },
    ],
  ])(`runs playwright with options: %s`, async (expected, options) => {
    execMock.mockImplementation((_command, _options, callback) => {
      callback(null, 'passed', '');
      return { stdout: { pipe: jest.fn() } } as unknown as ReturnType<typeof execMock>;
    });

    await executor(options, context);

    expect(execMock).toHaveBeenCalledWith(
      `playwright test src --config folder/playwright.config.ts ${expected}`.trim(),
      null,
      expect.any(Function),
    );
  });

  it('handle execution errors', async () => {
    const options: PlaywrightExecutorSchema = {
      e2eFolder: 'folder',
      packageRunner: 'npx',
      path: 'src/tests',
      config: 'config/playwright.config.ts',
    };

    const pipe = jest.fn();
    const error = new Error('some error');

    execMock.mockImplementation((_command, _options, callback) => {
      callback(error, 'passed', '');
      return { stdout: { pipe } } as unknown as ReturnType<typeof execMock>;
    });

    await expect(executor(options, context)).rejects.toEqual(error);

    expect(pipe).toHaveBeenCalledTimes(1);
  });

  it('starts dev server before running tests', async () => {
    const options: PlaywrightExecutorSchema = {
      skipServe: false,
      e2eFolder: 'folder',
      packageRunner: 'npx',
      path: 'src/tests',
      config: 'config/playwright.config.ts',
    };

    const pipe = jest.fn();

    execMock.mockImplementation((_command, _options, callback) => {
      callback(null, 'passed', '');
      return { stdout: { pipe } } as unknown as ReturnType<typeof execMock>;
    });

    await executor(options, context);

    expect(startDevServer).toHaveBeenCalledTimes(1);
    expect(startDevServer).toHaveBeenCalledWith(options, context);
  });
});
