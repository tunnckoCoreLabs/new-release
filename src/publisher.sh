#!/bin/bash

echo "Requires CIRCLECI and NPM_TOKEN enviroment variables!"
echo "Be aware that this is meant to be run on CI service like Travis or CircleCI."
echo "If you consider to provide these env variables it will override your ~/.npmrc file!"

if [ "$CIRCLECI" = "true" ]; then
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
  npm publish --registry ${NPM_REGISTRY:-"https://registry.npmjs.org/"}
fi;
