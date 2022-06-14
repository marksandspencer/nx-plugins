import { addDependenciesToPackageJson, formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { InitGeneratorSchema } from './schema';

export const removePlaywrightDeps = ({ dependencies = {}, ...json }) => {
  return { ...json, dependencies: { ...dependencies, '@mands/nx-playwright': undefined } };
};

export default async function playwrightInitGenerator(host: Tree, options: InitGeneratorSchema) {
  updateJson(host, 'package.json', removePlaywrightDeps);

  const installTask = addDependenciesToPackageJson(host, {}, { '@playwright/test': '1.22.2' });

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask);
}
