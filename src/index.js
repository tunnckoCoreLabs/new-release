/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const path = require('path')
const util = require('util')
const semver = require('semver')
const getPkg = require('get-pkg')
const parseGitLog = require('parse-git-log')
const detectNext = require('detect-next-version')

module.exports = async function newRelease (cwd) {
  const commits = await parseGitLog.promise(cwd)

  // TODO: respect all commits after the last tag,
  // not only the latest one (in some cases it is need!)
  const lastCommit = commits[0]
  const commit = detectNext(lastCommit.message, true)

  if (!commit.increment) return null

  return getNextVersion(commit, lastCommit)
}

async function getNextVersion (commit, { cwd }) {
  const name = path.basename(cwd)
  const pkgJson = await util.promisify(getPkg)(name)
  const currentVersion = pkgJson.version

  return semver.inc(currentVersion, commit.increment)
}
