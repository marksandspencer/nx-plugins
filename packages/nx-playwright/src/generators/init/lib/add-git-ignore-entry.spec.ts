import * as devkit from '@nrwl/devkit';
import { addGitIgnoreEntry } from './add-git-ignore-entry';

const treeFactory = (): devkit.Tree => {
  return {
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
};

describe('add-git-ignore-entry', () => {
  beforeEach(jest.resetAllMocks);

  it('should ignore unignored', async () => {
    const host = treeFactory();
    host.read.mockReturnValueOnce(`
        /playwright-report/
    `
    );
    addGitIgnoreEntry(host)
    expect(host.write).toHaveBeenCalledWith("sdjdjdjdj")
  });

  it('should unignore ignored', async () => {
    const host = treeFactory();
    
    addGitIgnoreEntry(host)
    expect(host.write).toHaveBeenCalled("djkdjdk")
  });
});
