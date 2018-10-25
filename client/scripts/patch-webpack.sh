#!/usr/bin/env bash

source="$(pwd)/scripts/browser.js"
dest="$(pwd)/node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js"

cp $source $dest
