import * as utilModule from 'util';
import executor from './executor';
import * as startDevServerModule from './lib/start-dev-server';

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

describe('executor', () => {
  beforeEach(jest.resetAllMocks);

  describe('with cli opts', () => {
    const options = {
      e2eFolder: 'folder',
      headed: true,
      browser: 'firefox',
      reporter: 'html',
    };

    it('concatenates overriding options to playwright command', async () => {
      const execCmd = jest.fn().mockResolvedValueOnce({ stdout: 'passed', stderr: '' });
      promisify.mockReturnValueOnce(execCmd);

      await executor(options, context);

      const expected =
        'yarn playwright test src --config folder/playwright.config.ts --headed --browser=firefox --reporter=html';
      expect(execCmd).toHaveBeenCalledWith(expected);
    });
  });

  describe('playwright execution', () => {
    const options = {
      e2eFolder: 'folder',
    };

    it('returns true when passes', async () => {
      promisify.mockReturnValueOnce(
        jest.fn().mockResolvedValueOnce({ stdout: 'passed', stderr: '' }),
      );

      const { success } = await executor(options, context);

      expect(success).toBe(true);

      expect(console.error).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Playwright output passed');

      expect(startDevServer).toHaveBeenCalledTimes(1);
      expect(startDevServer).toHaveBeenCalledWith(options, context);
    });

    it('logs error from output', async () => {
      promisify.mockReturnValueOnce(
        jest.fn().mockResolvedValueOnce({ stdout: 'passed', stderr: 'some error' }),
      );

      const { success } = await executor(options, context);

      expect(success).toBe(true);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Playwright errors some error');
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Playwright output passed');
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
