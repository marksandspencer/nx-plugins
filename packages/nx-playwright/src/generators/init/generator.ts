import {
  addDependenciesToPackageJson,
  formatFiles,
  runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import { playwrightAxeVersion, playwrightTestVersion, playwrightVersion } from '../../versions';
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
    {
      '@playwright/test': playwrightTestVersion,
      playwright: playwrightVersion,
      ...(options.includeAxe ? { 'axe-playwright': playwrightAxeVersion } : {}),
    },
  );

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  addGitIgnoreEntry(host);

  return runTasksInSerial(installTask);
}
