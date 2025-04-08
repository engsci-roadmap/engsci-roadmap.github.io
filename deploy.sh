#!/bin/bash

# Build the project
npm run build

# Copy the .nojekyll file to the dist folder
cp public/.nojekyll dist/

# If using gh-pages manually, uncomment the following line
# npm run deploy 