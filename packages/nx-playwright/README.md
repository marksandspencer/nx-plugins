# nx-playwright

NX Plugin for Playwright end-to-end test in nx monorepo using the native Playwright runner.

## Usage

`cd` into your NX monorepo.

`yarn add @mands/nx-playwright -D`

`yarn nx generate @mands/nx-playwright:project name-of-the-app-e2e --project name-of-the-app`

`yarn nx e2e name-of-the-app-e2e`

## Testing locally

> **Warning** when using the `--cleanup` option, this script will undo any local changes on your target NX workspace

- Create new NX workspace
- Create a new application
- Make sure `LOCAL_TEST_WORKSPACE` points to your newly created NX workspace
- Run `./local-test.sh` (optionally use `--cleanup` to revert changes after the script is run)
