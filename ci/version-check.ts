import fetch from 'isomorphic-unfetch';

const { version } = require(`${process.cwd()}/packages/nx-playwright/package.json`);
const { version: mainVersion } = require(`${process.cwd()}/package.json`);

console.log(`Current version ${version}`);

type VersionData = { name: string };

const validateVersion = async () => {
  if (version !== mainVersion) {
    return Promise.reject(`Please ensure top level version and package version are the same`);
  }
  const response = await fetch(`https://api.github.com/repos/marksandspencer/nx-plugins/tags`);
  if (response.status >= 400) {
    return Promise.reject(`Invalid response for tag request ${response.status}`);
  }
  const data = (await response.json()) as VersionData[];
  const releases = (data as []).map(({ name }: { name: string }) => name);
  if (!releases.length || releases.includes(version)) {
    return Promise.reject(
      `Version ${version} has already been released, please update nx-playwright version`,
    );
  }
};

validateVersion()
  .then(() => {
    console.info(`Version ${version} is valid`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
