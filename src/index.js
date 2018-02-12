/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const fs = require('fs')
const path = require('path')
const semver = require('semver')
const latestVersion = require('latest-version')
const { shell } = require('execa-pro')
const parseGitLog = require('parse-git-log')
const detectNext = require('detect-next-version')

module.exports = { prepublish, publish }

/**
 * Get package.json of current working directory
 *
 * @param {string} cwd
 * @returns
 */
async function readCwdPackage (cwd) {
  const fp = path.join(cwd, 'package.json')
  return new Promise((resolve, reject) => {
    fs.readFile(fp, 'utf8', (e, res) => {
      if (e) {
        reject(e)
      } else {
        resolve(res)
      }
    })
  })
}

/**
 *
 * @param {string} dir
 */
async function prepublish (dir) {
  const commits = await parseGitLog.promise(dir)

  // TODO: respect all commits after the last tag,
  // not only the latest one (in some cases it is need!)
  const { contents, cwd } = commits[0]
  const { increment } = detectNext(contents, true)

  if (!increment) return null

  return getNextVersion(increment, cwd)
}

/**
 *
 * @param {string} increment
 * @param {string} cwd
 */
async function getNextVersion (increment, cwd) {
  const { name } = await (readCwdPackage(cwd).then(JSON.parse))
  const currentVersion = await latestVersion(name)
  const nextVersion = semver.inc(currentVersion, increment)

  return { currentVersion, nextVersion }
}

/**
 *
 * @param {string} nextVersion
 */
function publish (nextVersion) {
  return shell(
    [
      `yarn version --no-git-tag-version --new-version ${nextVersion}`,
      `${path.join(__dirname, 'npmpubli.sh')}`,
    ],
    { stdio: 'inherit', preferLocal: true }
  )
}
