# @mands/nx-playwright

[![MIT License](https://img.shields.io/github/license/marksandspencer/nx-plugins)](https://github.com/marksandspencer/nx-plugins/blob/main/LICENSE.md) ![Build](https://github.com/marksandspencer/nx-plugins/actions/workflows/release.yml/badge.svg) [![npm version](https://badge.fury.io/js/@mands%2Fnx-playwright.svg)](https://badge.fury.io/js/@mands%2Fnx-playwright) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/marksandspencer/nx-plugins/blob/main/CONTRIBUTING.md)

An [Nx plugin](https://nx.dev/packages/nx-plugin) to add support to an Nx monorepo for
Playwright testing using a native runner.

## Usage

Replacing the placeholders `<PATH-TO-NX-WORKSPACE>` and `<APP-NAME>`:

```sh
cd <PATH-TO-NX-WORKSPACE>
yarn add -D @mands/nx-playwright
yarn nx generate @mands/nx-playwright:project <APP-NAME>-e2e --project <APP-NAME>
yarn playwright install --with-deps
yarn nx e2e <APP-NAME>-e2e
```

## Execution Flags

`nx-playwright` has some flags that you can utilize at execution time

- `--browser=BROWSER_TYPE`: allowed browser types being `chromium`, `firefox` or `webkit` (or an `all` type to execute against all 3 types)
- `--format=FORMAT_TYPE`: this allows values such as `json` or `html`
- `--headed`: launches the browsers in non-headless mode
- `--runner`: runner to use for running playwright (npx, pnpn, or yarn). Defaults to yarn.
- `--skipServe`: skips the execution of a devServer
- `--timeout=TIMEOUT_IN_MS`: adds a timeout for your tests

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
