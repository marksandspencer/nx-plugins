import * as devkit from '@nrwl/devkit';
import playwrightInitGenerator, { removePlaywrightDeps } from './generator';

const MOCK_HOST: devkit.Tree = {
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

jest.spyOn(devkit, 'addDependenciesToPackageJson');
const updateJsonSpy = jest.spyOn(devkit, 'updateJson');
const formatFilesSpy = jest.spyOn(devkit, 'formatFiles');

describe('generator', () => {
  beforeEach(jest.resetAllMocks);

  it('should initiate playwright and skip formatting', async () => {
    updateJsonSpy.mockReturnValueOnce();
    formatFilesSpy.mockResolvedValueOnce();

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, { skipFormat: true });
    expect(playwrightInitTask).toBeTruthy();
    expect(devkit.addDependenciesToPackageJson).toHaveBeenCalled();
    expect(devkit.formatFiles).not.toHaveBeenCalled();
  });

  it('should initiate playwright and format the file', async () => {
    updateJsonSpy.mockReturnValueOnce();
    formatFilesSpy.mockResolvedValueOnce();

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, {});
    expect(playwrightInitTask).toBeTruthy();
    expect(devkit.addDependenciesToPackageJson).toHaveBeenCalled();
    expect(devkit.formatFiles).toHaveBeenCalled();
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
