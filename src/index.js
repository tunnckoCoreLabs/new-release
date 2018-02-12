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

module.exports = { prepublish, publish, getVersions }

/**
 * Get package.json of current working directory
 *
 * @param {string} cwd
 * @returns
 */
async function readCwdPackage (cwd) {
  const fp = path.join(cwd, 'package.json')
  const promise = new Promise((resolve, reject) => {
    fs.readFile(fp, 'utf8', (e, res) => {
      if (e) {
        reject(e)
      } else {
        resolve(res)
      }
    })
  })

  return promise.then(JSON.parse)
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
  const increment = detectNext(contents)

  if (!increment) return null

  return getVersions(increment, { cwd })
}

/**
 *
 * @param {string} increment
 * @param {object} options
 */
async function getVersions (increment, { cwd, name }) {
  let packageName = null

  if (cwd) {
    packageName = (await readCwdPackage(cwd)).name
  } else if (name) {
    packageName = name
  } else {
    throw new Error('new-release: getVersions expect options.cwd or options.name')
  }

  const lastVersion = await latestVersion(packageName)
  const nextVersion = semver.inc(lastVersion, increment)

  return { lastVersion, nextVersion }
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
