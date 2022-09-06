import { addDependenciesToPackageJson, formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { addGitIgnoreEntry } from './lib/add-git-ignore-entry';
import { InitGeneratorSchema } from './schema';

export const removePlaywrightDeps = ({ dependencies = {}, ...json }) => {
  return { ...json, dependencies: { ...dependencies, '@mands/nx-playwright': undefined } };
};

export default async function playwrightInitGenerator(host: Tree, options: InitGeneratorSchema) {
  updateJson(host, 'package.json', removePlaywrightDeps);

  const installTask = addDependenciesToPackageJson(
    host,
    {},
    { '@playwright/test': '1.25.1', playwright: '1.25.1' },
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  addGitIgnoreEntry(host);

  return runTasksInSerial(installTask);
}
