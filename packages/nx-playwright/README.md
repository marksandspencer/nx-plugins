# nx-playwright

## Usage

`cd` into your NX monorepo.

`yarn add @mands/nx-playwright -D`

`yarn nx generate @mands/nx-playwright:project name-of-the-app-e2e --project name-of-the-app`

`yarn nx e2e name-of-the-app-e2e`

## Testing locally

> **Warning** this will undo any local changes on your target NX workspace

- Create new NX workspace
- Set `LOCAL_TEST_WORKSPACE` folder on `test.sh`
- Run `./test.sh`
