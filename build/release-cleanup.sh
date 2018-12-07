#!/usr/bin/env bash

# Deps
npm i
cd server && npm i && cd ..

# Compile / Test
npm run compile
npm run test:server

# Remove server devDependencies
cd server && npm i --production && cd ..
