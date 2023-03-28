import { addProjectConfiguration, readJson, updateWorkspaceConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import generator from './generator';

describe('nx-playwright generator', () => {
  it('generates correct project.json with required options + project', async () => {
    const host = createTree();

    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
    });
    const projectJson = readJson(host, 'e2e/test-generator/project.json');

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

  it('returns correct error message when provided project does not exist', async () => {
    const host = createTree();
    await expect(
      generator(host, {
        name: 'test-generator',
        linter: Linter.EsLint,
        project: 'bad-project',
      }),
    ).rejects.toMatchInlineSnapshot(`"bad-project is not a valid project in the workspace"`);
  });

  it('generates correct project.json with required options + project, packageRunner', async () => {
    const host = createTree();
    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
      packageRunner: 'pnpm',
    });
    const projectJson = readJson(host, 'e2e/test-generator/project.json');

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

function createTree() {
  const host = createTreeWithEmptyWorkspace();
  updateWorkspaceConfiguration(host, {
    workspaceLayout: {
      appsDir: 'e2e',
      libsDir: 'packages',
    },
    version: 2,
  });
  addProjectConfiguration(host, 'test-project', { root: './apps/test-project' });
  return host;
}
