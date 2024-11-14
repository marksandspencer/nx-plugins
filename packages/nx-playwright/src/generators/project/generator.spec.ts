import { addProjectConfiguration, readJson, updateWorkspaceConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/eslint';
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
          executor: '@nx/eslint:eslint',
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
          executor: '@nx/eslint:eslint',
          outputs: ['{options.outputFile}'],
          options: { lintFilePatterns: ['e2e/test-generator/**/*.{ts,tsx,js,jsx}'] },
        },
      },
      tags: [],
      implicitDependencies: ['test-project'],
    });
  });

  it('adds axe configuration to e2e target in project.json when includeAxe option is enabled', async () => {
    const host = createTree();

    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
      includeAxe: true,
    });
    const projectJson = readJson(host, 'e2e/test-generator/project.json');

    expect(projectJson.targets.e2e.configurations).toEqual(
      expect.objectContaining({
        axe: {
          path: './axe-tests',
          skipServe: true,
        },
      }),
    );
  });

  it('generates axe files when includeAxe option is enabled', async () => {
    const host = createTree();

    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
      includeAxe: true,
    });

    expect(host.exists('e2e/test-generator/axe.config.ts')).toBe(true);
    expect(host.exists('e2e/test-generator/axe-tests/axe-tests.spec.ts')).toBe(true);
  });

  it('does not generate axe files when includeAxe option is not present', async () => {
    const host = createTree();

    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
    });

    expect(host.exists('e2e/test-generator/axe.config.ts')).toBe(false);
    expect(host.exists('e2e/test-generator/axe-tests/axe-tests.spec.ts')).toBe(false);
  });

  it('generates correct .eslintrc.json', async () => {
    const host = createTree();

    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
    });
    const eslintJson = readJson(host, 'e2e/test-generator/.eslintrc.json');

    expect(eslintJson).toEqual({
      extends: ['../../.eslintrc.json'],
      ignorePatterns: ['!**/*'],
      overrides: [
        {
          files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
          rules: { 'jest/no-done-callback': 'off' },
        },
        {
          files: ['*.ts', '*.tsx'],
          rules: { 'jest/no-done-callback': 'off' },
        },
        {
          files: ['*.js', '*.jsx'],
          rules: {},
        },
      ],
    });
  });

  it('adds an override for AXE tests to .eslintrc.json when includeAxe option is present', async () => {
    const host = createTree();

    await generator(host, {
      name: 'test-generator',
      linter: Linter.EsLint,
      project: 'test-project',
      includeAxe: true,
    });
    const eslintJson = readJson(host, 'e2e/test-generator/.eslintrc.json');

    expect(eslintJson).toEqual({
      extends: ['../../.eslintrc.json'],
      ignorePatterns: ['!**/*'],
      overrides: expect.arrayContaining([
        {
          files: ['**/axe-tests/axe-tests.spec.ts'],
          rules: { 'jest/expect-expect': 'off' },
        },
      ]),
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
