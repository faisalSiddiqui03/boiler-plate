#!/bin/sh
if [ -d "./.sourcemaps" ]; then
    [ "$(ls -A ./.sourcemaps)" ] && rm ./.sourcemaps/*
else
    mkdir ./.sourcemaps
fi

cp ./www/*.map ./.sourcemaps