import * as devkit from '@nrwl/devkit';
import playwrightInitGenerator from './generator';

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

const updateJsonSpy = jest.spyOn(devkit, 'updateJson');
const addDependenciesToPackageJsonSpy = jest.spyOn(devkit, 'addDependenciesToPackageJson');
const formatFilesSpy = jest.spyOn(devkit, 'formatFiles');

// jest.mock('@nrwl/devkit', () => ({
//   __esModule: true,
//   ...(jest.requireActual('@nrwl/devkit') as any),
//   updateJson: jest
//     .fn()
//     .mockReturnValueOnce({ dependencies: { foo: 'bar' } })
//     .mockReturnValue('{}'),
//   addDependenciesToPackageJson: jest.fn().mockReturnValue({
//     dependencies: {},
//     devDependencies: { foo: 'bar' },
//   }),
//   formatFiles: jest.fn(),
// }));

describe('generator', () => {
  beforeEach(jest.resetAllMocks);

  fit('should initiate playwright and skip formatting', async () => {
    updateJsonSpy.mockReturnValueOnce();
    formatFilesSpy.mockResolvedValueOnce();

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, { skipFormat: true });
    expect(playwrightInitTask).toBeTruthy();
    expect(devkit.formatFiles).not.toHaveBeenCalled();
  });

  xit('remove existing "@mands/nx-playwright" from package.json and initiate playwright', async () => {
    formatFilesSpy.mockResolvedValueOnce();

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, { skipFormat: true });
    expect(playwrightInitTask).toBeTruthy();
    expect(devkit.formatFiles).not.toHaveBeenCalled();
  });

  fit('should initiate playwright and format the file', async () => {
    updateJsonSpy.mockReturnValueOnce();
    formatFilesSpy.mockResolvedValueOnce();

    const host = treeFactory();

    const playwrightInitTask = await playwrightInitGenerator(host, {});
    expect(playwrightInitTask).toBeTruthy();
    expect(devkit.formatFiles).toHaveBeenCalled();
  });
});
