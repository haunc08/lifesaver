// Builds the game and publishes it to GitHub Pages by pushing the built files
// to the `gh-pages` branch, which Pages serves at https://<owner>.github.io/<repo>/.
//
//   pnpm deploy:pages
//
// It publishes whatever is in the working folder, so commit and run the checks first.
// (A GitHub Action would do this on every push, but Actions could not run on this
// account when the site was set up; see docs/status.md.)
import { execFileSync } from 'node:child_process'
import { copyFileSync, cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...options })
const git = (args, cwd) => run('git', args, { cwd }).trim()

const remote = git(['remote', 'get-url', 'origin'])
const repo = remote.replace(/\.git$/, '').split('/').pop()
const commit = git(['rev-parse', '--short', 'HEAD'])
const dirty = git(['status', '--porcelain']) !== ''

// The site lives in a sub-folder named after the repository.
run('pnpm', ['build'], { env: { ...process.env, BASE_PATH: `/${repo}/` }, stdio: 'inherit' })
// Pages has no rewrite rules; serving the app for unknown paths lets deep links load.
copyFileSync('dist/index.html', 'dist/404.html')
// Tells Pages to serve the files as they are.
writeFileSync('dist/.nojekyll', '')

const out = mkdtempSync(join(tmpdir(), 'lifesaver-pages-'))
try {
  cpSync('dist', out, { recursive: true })
  git(['init', '-q', '-b', 'gh-pages'], out)
  git(['config', 'user.name', git(['config', 'user.name'])], out)
  git(['config', 'user.email', git(['config', 'user.email'])], out)
  git(['add', '-A'], out)
  git(['commit', '-q', '-m', `Publish build of ${commit}${dirty ? ' with uncommitted changes' : ''}`], out)
  git(['push', '-q', '-f', remote, 'gh-pages'], out)
} finally {
  rmSync(out, { recursive: true, force: true })
}
console.log(`Published ${commit}. The site updates in about a minute.`)
