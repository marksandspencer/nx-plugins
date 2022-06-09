import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { existsSync } from 'fs';
import * as path from 'path';
import playwrightInitGenerator from '../init/generator';
import { addLinting } from './lib/add-linting';
import { normalizeOptions, NxPlaywrightGeneratorNormalizedSchema } from './lib/normalize-options';
import { NxPlaywrightGeneratorSchema } from './schema';

export default async function (host: Tree, options: NxPlaywrightGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, { ...options, type: 'app' });
  const playwrightInitTask = await playwrightInitGenerator(host, { skipFormat: true });

  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    projectType: 'application',
    targets: {
      e2e: {
        executor: '@mands/nx-playwright:playwright-executor',
        options: {
          e2eFolder: normalizedOptions.projectRoot,
          devServerTarget: options.project ? `${options.project}:serve` : undefined,
        },
        configurations: {
          production: {
            devServerTarget: options.project ? `${options.project}:serve:production` : undefined,
          },
        },
      },
    },
    tags: normalizedOptions.parsedTags,
    implicitDependencies: options.project ? [options.project] : undefined,
  });

  addFiles(host, normalizedOptions);

  const lintTask = await addLinting(host, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(playwrightInitTask, lintTask);
}

const addFiles = (host: Tree, options: NxPlaywrightGeneratorNormalizedSchema) => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };

  if (!existsSync(`${host.root}/playwright.config.base.ts`)) {
    generateFiles(host, path.join(__dirname, 'root-config'), '.', templateOptions);
  }
  generateFiles(host, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
};
