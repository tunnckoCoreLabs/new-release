#!/usr/bin/env node

/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

/* eslint-disable no-console */

const isCI = require('is-ci')
const minimist = require('minimist')
const { prepublish, publish } = require('./index.js')

const argv = minimist(process.argv.slice(2), {
  default: {
    cwd: process.cwd(),
    ci: true,
  },
})

if (argv.ci && !isCI) {
  console.error('Publishing is only allowed on CI service!')
  process.exit(1)
}

prepublish(argv.cwd)
  .then((versions) => (versions ? publish(versions.nextVersion) : true))
  .catch((er) => {
    console.error('new-release error!')
    console.error(er.stack)

    process.exit(1)
  })
  .then((result) => {
    if (result === true) {
      console.log('skip npm publishing')
    } else {
      console.log('published sucessfully')
    }
    process.exit(0)
  })
