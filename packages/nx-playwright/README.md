# @mands/nx-playwright

[![MIT License](https://img.shields.io/github/license/marksandspencer/nx-plugins)](https://github.com/marksandspencer/nx-plugins/blob/main/LICENSE.md)

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

## Testing this plugin locally

Create a new Nx workspace containing one application. Then run, in the root of this repo:

```sh
./local-test-nx-playwright.sh -w path/to/workspace -a app-name
```

⚠️ The flag `-c` can optionally be used to revert any changes made by the script.
However, this is a destructive operation that will destroy **all** local changes made to your
target Nx workspace, whether tracked or untracked.
