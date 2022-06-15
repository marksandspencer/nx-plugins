# @mands/nx-playwright

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?color=blue&style=flat-square)](https://opensource.org/licenses/MIT)

An [Nx plugin](https://nx.dev/packages/nx-plugin) to add support to an Nx monorepo for
Playwright testing using a native runner.

## Usage

Replacing the placeholders `<MONOREPO-PATH>` and `<APP-NAME>`:

```sh
cd <MONOREPO-PATH>
yarn add -D @mands/nx-playwright
yarn nx generate @mands/nx-playwright:project <APP-NAME>-e2e --project <APP-NAME>
yarn playwright install --with-deps
yarn nx e2e <APP-NAME>-e2e
```

## Testing this plugin locally

Create a new Nx workspace containing one application. Then run, in the root of this repo:

```sh
LOCAL_TEST_WORKSPACE=<path-to-workspace> ./local-test-nx-playwright.sh
```

⚠️ Optionally, use the flag `--cleanup` to revert any changes made by the script. However, this will undo **all** local changes made to your target Nx workspace.
