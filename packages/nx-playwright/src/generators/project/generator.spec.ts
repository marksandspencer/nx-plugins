import type { Tree } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { FsTree } from 'nx/src/generators/tree';
import generator from './generator';

describe('nx-playwright generator', () => {
  it('generates correct project.json with required options + project', async () => {
    const host: Tree = new FsTree('.', true);
    const generate = await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
    });
    await generate();
    const projectJsonString = host.read('e2e/test-generator/project.json').toString();
    const projectJson = JSON.parse(projectJsonString);

    expect(projectJson).toEqual({
      $schema: '../../node_modules/nx/schemas/project-schema.json',
      sourceRoot: 'e2e/test-generator/src',
      name: 'test-generator',
      projectType: 'application',
      targets: {
        e2e: {
          executor: '@mands/nx-playwright:playwright-executor',
          options: {
            e2eFolder: 'e2e/test-generator',
            devServerTarget: 'test-project:serve',
            packageRunner: 'yarn',
          },
          configurations: {
            production: {
              devServerTarget: 'test-project:serve:production',
            },
          },
        },
        'ts-check': {
          executor: 'nx:run-commands',
          options: {
            commands: [
              {
                command: `tsc --build --force --verbose apps/test-project-e2e/tsconfig.json`,
              },
            ],
          },
        },
        lint: {
          executor: '@nrwl/linter:eslint',
          outputs: ['{options.outputFile}'],
          options: { lintFilePatterns: ['e2e/test-generator/**/*.{ts,tsx,js,jsx}'] },
        },
      },
      tags: [],
      implicitDependencies: ['test-project'],
    });
  });

  it('generates correct project.json with required options + project, packageRunner', async () => {
    const host: Tree = new FsTree('.', true);
    const generate = await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
      packageRunner: 'pnpm',
    });
    await generate();
    const projectJsonString = host.read('e2e/test-generator/project.json').toString();
    const projectJson = JSON.parse(projectJsonString);

    expect(projectJson).toEqual({
      $schema: '../../node_modules/nx/schemas/project-schema.json',
      sourceRoot: 'e2e/test-generator/src',
      name: 'test-generator',
      projectType: 'application',
      targets: {
        e2e: {
          executor: '@mands/nx-playwright:playwright-executor',
          options: {
            e2eFolder: 'e2e/test-generator',
            devServerTarget: 'test-project:serve',
            packageRunner: 'pnpm',
          },
          configurations: {
            production: {
              devServerTarget: 'test-project:serve:production',
            },
          },
        },
        'ts-check': {
          executor: 'nx:run-commands',
          options: {
            commands: [
              {
                command: `tsc --build --force --verbose apps/test-project-e2e/tsconfig.json`,
              },
            ],
          },
        },
        lint: {
          executor: '@nrwl/linter:eslint',
          outputs: ['{options.outputFile}'],
          options: { lintFilePatterns: ['e2e/test-generator/**/*.{ts,tsx,js,jsx}'] },
        },
      },
      tags: [],
      implicitDependencies: ['test-project'],
    });
  });
});
