#!/usr/bin/env node

'use strict';

const path = require('path');
const proc = require('process');
const parser = require('mri');
const esmLoader = require('esm');

const pkg = require('./package');

const esmRequire = esmLoader(module);

function interop(x) {
  if (Object.keys(x).length === 1 && x.default) {
    return x.default;
  }
  return x;
}

const mod = esmRequire(path.join(__dirname, 'src', 'cli.js'));
const cli = interop(mod);

const argv = parser(proc.argv.slice(2), {
  default: {
    cwd: proc.cwd(),
    ci: true,
  },
});

cli(pkg, argv).catch(console.error);
