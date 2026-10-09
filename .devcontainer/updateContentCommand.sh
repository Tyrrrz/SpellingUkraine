#!/usr/bin/env sh
set -eu

# Don't fail container creation on NPM install errors
npm install || exit 0
