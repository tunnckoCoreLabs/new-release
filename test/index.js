/**
 * @copyright 2017-present, Charlike Mike Reagent <olsten.larck@gmail.com>
 * @license Apache-2.0
 */

const test = require('mukla')
const { prepublish, publish, getVersions } = require('../src/index.js')

test('exports an object with "publish" and "prepublish" funciotions', (done) => {
  test.strictEqual(typeof prepublish, 'function')
  test.strictEqual(typeof publish, 'function')
  test.strictEqual(typeof getVersions, 'function')
  done()
})

test('getVersions should return an object when options.name is given', async () => {
  const versions = await getVersions('minor', { name: 'parse-commit-message' })
  console.log(versions)

  test.strictEqual(typeof versions, 'object')
  test.strictEqual(typeof versions.lastVersion, 'string')
  test.strictEqual(typeof versions.nextVersion, 'string')
})
