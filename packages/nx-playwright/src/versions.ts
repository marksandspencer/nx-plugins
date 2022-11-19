import packageJson from '../package.json';

export const playwrightVersion = packageJson.peerDependencies.playwright;
export const playwrightTestVersion = packageJson.peerDependencies['@playwright/test'];
