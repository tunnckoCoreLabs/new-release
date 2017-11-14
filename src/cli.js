#!/usr/bin/env node

/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const { prepublish, publish } = require('./index.js')

const cwd = process.cwd()

prepublish(cwd)
  .then(({ nextVersion }) => publish(nextVersion))
  .catch((er) => {
    /* eslint-disable no-console */
    console.error('new-release error!')
    console.error(er.stack)

    process.exit(1)
  })
