# @mands/nx-playwright

[![MIT License](https://img.shields.io/github/license/marksandspencer/nx-plugins)](https://github.com/marksandspencer/nx-plugins/blob/main/LICENSE.md) ![Build](https://github.com/marksandspencer/nx-plugins/actions/workflows/release.yml/badge.svg) [![npm version](https://badge.fury.io/js/@mands%2Fnx-playwright.svg)](https://badge.fury.io/js/@mands%2Fnx-playwright) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/marksandspencer/nx-plugins/blob/main/CONTRIBUTING.md)

An [Nx plugin](https://nx.dev/packages/nx-plugin) that adds [Playwright](https://playwright.dev/) end-to-end testing using a native runner to your NX workspace.

## Setup

> **Note** Don't forget to replace the placeholder `<APP-NAME>`

### Installation

```sh
yarn add --dev @mands/nx-playwright
yarn playwright install --with-deps
```

### Generate e2e test app

> **Warning** If you have an existing e2e test app, please remove it first `yarn nx generate remove <APP-NAME>-e2e`

```sh
yarn nx generate @mands/nx-playwright:project <APP-NAME>-e2e --project <APP-NAME>
```

### Running tests

```sh
yarn nx e2e <APP-NAME>-e2e
```

## Execution Flags

`nx-playwright` has some flags that you can utilize at execution time

- `--browser=BROWSER_TYPE`: allowed browser types being `chromium`, `firefox` or `webkit` (or an `all` type to execute against all 3 types)
- `--testProject`: playwright project name to run (NOTE: this is `--project` option in playwright itself, but it conflicts with nx's option)
- `--config`: configuration file. Defaults to `playwright.config.ts`
- `--format=FORMAT_TYPE`: this allows values such as `json` or `html`
- `--headed`: launches the browser in non-headless mode
- `--debug`: runs tests in a browser plus another interactive debugger window that you can pause/play tests
- `--packageRunner`: package runner to use for running playwright (`npx`, `pnpm`, or `yarn`), use only when running NX directly, not required when running via package manager (e.g. `pnpm nx run your-app-e2e:e2e`)
- `--path`: path to run tests at. Defaults to `src`
- `--skipServe`: skips the execution of a devServer
- `--timeout=<number>`: adds a timeout for your tests in milliseconds
- `--grep=<RegExp|Array<RegExp>>`: filter to only run tests with a title matching one of the patterns
- `--grepInvert=<RegExp|Array<RegExp>>`: filter to only run tests with a title not matching one of the patterns

> **Note** These flags can also be used in `project.json` or `nx.json`

These flags align with the standard [playwright flags](https://playwright.dev/docs/test-cli#reference), as well as the [nx-cypress](https://nx.dev/packages/cypress/executors/cypress#options) ones.

## Testing this plugin locally

Create a new Nx workspace containing one application. Then run, in the root of this repo:

```sh
./local-test.sh -w path/to/workspace -a app-name
```

⚠️ The flag `-C` can optionally be used to reverse any changes made to the workspace during the test run.
However, this is a potentially destructive operation that performs a stash save before the run and
a stash pop at the end of the run.

### Example script for testing locally from scratch

```bash
git clone git@github.com:marksandspencer/nx-plugins.git

# Create a test workspace and app, and remove the e2e app

yarn create nx-workspace --name=test-nx --appName=test-app --style=@emotion/styled --preset=next --nxCloud=false --interactive=false
pushd test-nx
yarn nx generate remove test-app-e2e
git commit -am "Remove test-app-e2e"
popd

# Run the test script
pushd nx-plugins
./local-test.sh -w ../test-nx -a test-app -C
popd
```
