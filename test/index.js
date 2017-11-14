/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const test = require('mukla')
const newRelease = require('../src/index.js')

test('exports a function', (done) => {
  test.strictEqual(typeof newRelease, 'function')
  done()
})
