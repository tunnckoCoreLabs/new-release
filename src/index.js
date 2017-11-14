/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const path = require('path')
const util = require('util')
const semver = require('semver')
const getPkg = require('get-pkg')
const { shell } = require('execa-pro')
const parseGitLog = require('parse-git-log')
const detectNext = require('detect-next-version')

module.exports = { prepublish, publish }

/**
 *
 * @param {*} dir
 */

async function prepublish (dir) {
  const commits = await parseGitLog.promise(dir)

  // TODO: respect all commits after the last tag,
  // not only the latest one (in some cases it is need!)
  const { message, cwd } = commits[0]
  const { increment } = detectNext(message, true)

  if (!increment) return null

  return getNextVersion(increment, cwd)
}

/**
 *
 * @param {*} increment
 * @param {*} cwd
 */

async function getNextVersion (increment, cwd) {
  const name = path.basename(cwd)
  const pkgJson = await util.promisify(getPkg)(name)
  const currentVersion = pkgJson.version
  const nextVersion = semver.inc(currentVersion, increment)

  return { currentVersion, nextVersion }
}

/**
 *
 * @param {*} nextVersion
 */

function publish (nextVersion) {
  return shell([
    `yarn version --no-git-tag-version --new-version ${nextVersion}`,
    `${path.join(__dirname, 'npmpubli.sh')}`,
  ])
}
