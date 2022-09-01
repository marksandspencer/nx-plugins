import { Tree } from '@nrwl/devkit';
import ignore from 'ignore';

export const addGitIgnoreEntry = (host: Tree) => {
  const content = host.exists('.gitignore') ? host.read('.gitignore', 'utf-8').trimEnd() : '';

  const ig = ignore();
  ig.add(host.read('.gitignore', 'utf-8'));

  const addIgnore = (existingIgnore: string, ignoreToAdd: string) => {
    return ig.ignores(existingIgnore) ? '' : ignoreToAdd;
  };

  const resultsIgnore = addIgnore('app/example/test-results', `\n\n# Playwright\n**/test-results/`);
  const reportsIgnore = addIgnore('app/example/playwright-report', `\n**/playwright-report/`);
  const cacheIgnore = addIgnore('app/example/playwright/.cache', '\n**/playwright/.cache/\n');

  host.write('.gitignore', `${content}${resultsIgnore}${reportsIgnore}${cacheIgnore}`);
};

import ignore from 'ignore';

export function addGitIgnoreEntry(host: Tree) {
  if (!host.exists('.gitignore')) {
    return;
  }

  let content = host.read('.gitignore', 'utf-8').trimEnd();

  const ig = ignore();
  ig.add(host.read('.gitignore', 'utf-8'));

  if (!ig.ignores('app/example/test-results')) {
    content = `${content}\n\n# Playwright\n**/test-results/`;
  }

  if (!ig.ignores('app/example/playwright-report')) {
    content = `${content}\n**/playwright-report/`;
  }

  if (!ig.ignores('app/example/playwright/.cache')) {
    content = `${content}\n**/playwright/.cache/\n`;
  }

  host.write('.gitignore', content);
}
