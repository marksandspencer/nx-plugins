const { execSync } = require('child_process');

const { version } = require(`${process.cwd()}/packages/nx-playwright/package.json`);

console.log(`Current version ${version}`);

const releases: string[] = execSync('git tag').toString().split('\n').filter(Boolean);

console.log('Existing releases', releases);

if (!releases.length || releases.includes(version)) {
  console.error(`Version ${version} already released, please update nx-playwright version`);
  process.exit(1);
}
