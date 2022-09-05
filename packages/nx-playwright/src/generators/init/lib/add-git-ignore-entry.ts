import { Tree } from '@nrwl/devkit';
import ignore from 'ignore';

export function addGitIgnoreEntry (host: Tree) {
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
