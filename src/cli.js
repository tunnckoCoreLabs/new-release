#!/usr/bin/env node

/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const path = require('path')
const { shell } = require('execa-pro')
const newRelease = require('./index.js')

async function init () {
  const cwd = process.cwd()
  const { currentVersion, nextVersion } = newRelease(cwd)

  await shell([
    `yarn version --no-git-tag-version --new-version ${nextVersion}`,
    `${path.join(__dirname, 'publisher.sh')}`,
  ])
}

init()
