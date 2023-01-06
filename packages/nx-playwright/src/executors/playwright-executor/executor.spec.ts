import utilModule from 'util';
import executor from './executor';
import * as startDevServerModule from './lib/start-dev-server';
import { PlaywrightExecutorSchema } from './schema-types';

const startDevServer = jest
  .spyOn(startDevServerModule, 'startDevServer')
  .mockResolvedValueOnce(undefined);
const promisify = jest.spyOn(utilModule, 'promisify');

const context = {
  root: '',
  isVerbose: false,
  workspace: { version: 1, projects: {}, npmScope: '' },
  cwd: '',
};

console.error = jest.fn().mockReturnValue(null);
console.info = jest.fn().mockReturnValue(null);
console.debug = jest.fn().mockReturnValue(null);

describe('executor', () => {
  beforeEach(jest.resetAllMocks);

  describe('building runner command', () => {
    it('uses correct runner', async () => {
      const options: PlaywrightExecutorSchema = {
        e2eFolder: 'folder',
        packageRunner: 'npx',
      };

      const execCmd = jest.fn().mockResolvedValueOnce({ stdout: 'passed', stderr: '' });
      promisify.mockReturnValueOnce(execCmd);

      await executor(options, context);

      const expected =
        'npx playwright test src --config folder/playwright.config.ts  && echo PLAYWRIGHT_PASS';
      expect(execCmd).toHaveBeenCalledWith(expected);
    });

    it.each<[string, PlaywrightExecutorSchema]>([
      [
        '--headed --browser=firefox --reporter=html --timeout=1234 --grep=@tag1 && echo PLAYWRIGHT_PASS',
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
        '--grep-invert=@tag1 && echo PLAYWRIGHT_PASS',
        {
          e2eFolder: 'folder',
          grepInvert: '@tag1',
        },
      ],
      [
        '--pass-with-no-tests && echo PLAYWRIGHT_PASS',
        {
          passWithNoTests: true,
          e2eFolder: 'folder',
        },
      ],
    ])(`runs playwright with options: %s`, async (expected, options) => {
      const execCmd = jest.fn().mockResolvedValueOnce({ stdout: 'passed', stderr: '' });
      promisify.mockReturnValueOnce(execCmd);

      await executor(options, context);

      expect(execCmd).toHaveBeenCalledWith(
        `yarn playwright test src --config folder/playwright.config.ts ${expected}`.trim(),
      );
    });
  });

  describe('playwright execution', () => {
    const options: PlaywrightExecutorSchema = {
      e2eFolder: 'folder',
    };

    it('returns true when passes', async () => {
      promisify.mockReturnValueOnce(
        jest.fn().mockResolvedValueOnce({ stdout: 'PLAYWRIGHT_PASS', stderr: '' }),
      );

      const { success } = await executor(options, context);

      expect(success).toBe(true);

      expect(console.error).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Playwright output PLAYWRIGHT_PASS');

      expect(startDevServer).toHaveBeenCalledTimes(1);
      expect(startDevServer).toHaveBeenCalledWith(options, context);
    });

    it('logs error from output', async () => {
      promisify.mockReturnValueOnce(
        jest.fn().mockResolvedValueOnce({ stdout: 'PLAYWRIGHT_PASS', stderr: 'some error' }),
      );

      const { success } = await executor(options, context);

      expect(success).toBe(true);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Playwright errors some error');
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Playwright output PLAYWRIGHT_PASS');
    });

    it('fails gracefully when command fails', async () => {
      const error = new Error('fake error');
      promisify.mockReturnValueOnce(jest.fn().mockRejectedValueOnce(error));

      const { success } = await executor(options, context);

      expect(success).toBe(false);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Unexpected error', error);
    });
  });
});
