import { addDependenciesToPackageJson, formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { InitGeneratorSchema } from './schema';

export default async function playwrightInitGenerator(host: Tree, options: InitGeneratorSchema) {
  updateJson(host, 'package.json', (json) => {
    json.dependencies = json.dependencies || {};
    delete json.dependencies['@mands/nx-playwright'];

    return json;
  });

  const installTask = addDependenciesToPackageJson(host, {}, { '@playwright/test': '1.22.2' });

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(installTask);
}
