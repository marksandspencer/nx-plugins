import { readRootPackageJson } from '@nrwl/devkit';

export const playwrightVersion = readRootPackageJson().devDependencies.playwright;
export const playwrightTestVersion = readRootPackageJson().devDependencies['@playwright/test'];
