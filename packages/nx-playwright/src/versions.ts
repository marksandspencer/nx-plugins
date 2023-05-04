import packageJson from '../package.json';

export const playwrightAxeVersion = packageJson.peerDependencies['axe-playwright'];
export const playwrightVersion = packageJson.peerDependencies.playwright;
export const playwrightTestVersion = packageJson.peerDependencies['@playwright/test'];
