import { addDependenciesToPackageJson, formatFiles, Tree, updateJson } from '@nx/devkit';
import { playwrightAxeVersion } from '../../versions';
import playwrightInitGenerator, { removePlaywrightDeps } from './generator';

const MOCK_HOST: Tree = {
  root: '',
  read: jest.fn(),
  write: jest.fn(),
  exists: jest.fn(),
  delete: jest.fn(),
  rename: jest.fn(),
  isFile: jest.fn(),
  children: jest.fn(),
  listChanges: jest.fn(),
  changePermissions: jest.fn(),
};
const treeFactory = () => MOCK_HOST;

jest.mock('@nx/devkit', () => ({
  addDependenciesToPackageJson: jest.fn(),
  updateJson: jest.fn(),
  formatFiles: jest.fn(),
}));

const formatFilesMock = jest.mocked(formatFiles);
const addDependenciesToPackageJsonMock = jest.mocked(addDependenciesToPackageJson);
const updateJsonMock = jest.mocked(updateJson);

describe('generator', () => {
  beforeEach(jest.resetAllMocks);

  it('should initiate playwright and skip formatting', async () => {
    formatFilesMock.mockReturnValueOnce(undefined);
    updateJsonMock.mockReturnValueOnce(undefined);

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, { skipFormat: true });
    expect(playwrightInitTask).toBeTruthy();
    expect(addDependenciesToPackageJsonMock).toHaveBeenCalled();
    expect(formatFilesMock).not.toHaveBeenCalled();
  });

  it('should initiate playwright and format the file', async () => {
    updateJsonMock.mockReturnValueOnce(undefined);
    formatFilesMock.mockResolvedValueOnce(undefined);

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, {});
    expect(playwrightInitTask).toBeTruthy();
    expect(addDependenciesToPackageJsonMock).toHaveBeenCalled();
    expect(formatFilesMock).toHaveBeenCalled();
  });

  it('does not add axe-playwright to package.json when includeAxe option is not present', async () => {
    updateJsonMock.mockReturnValueOnce(undefined);
    formatFilesMock.mockResolvedValueOnce(undefined);

    const host = treeFactory();

    await playwrightInitGenerator(host, {});

    expect(addDependenciesToPackageJsonMock).toHaveBeenCalledWith(
      host,
      {},
      expect.objectContaining({
        'axe-playwright': undefined,
      }),
    );
  });

  it('adds axe-playwright to package.json when includeAxe option is true', async () => {
    updateJsonMock.mockReturnValueOnce(undefined);
    formatFilesMock.mockResolvedValueOnce(undefined);

    const host = treeFactory();

    await playwrightInitGenerator(host, { includeAxe: true });

    expect(addDependenciesToPackageJsonMock).toHaveBeenCalledWith(
      host,
      {},
      expect.objectContaining({
        'axe-playwright': playwrightAxeVersion,
      }),
    );
  });

  it('remove existing "@mands/nx-playwright" package from package.json', async () => {
    const packageJSON = {
      dependencies: { '@mands/nx-playwright': '0.0,1' },
    };
    const result = removePlaywrightDeps(packageJSON);

    expect(result.dependencies).toEqual({});
  });

  it('create "dependencies" property if "dependencies" is undefined', async () => {
    const packageJSON = {};
    const result = removePlaywrightDeps(packageJSON);

    expect(result.dependencies).toEqual({});
  });
});
