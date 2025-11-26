#!/bin/bash

#  C.js Build Script
#  From your command line inside the C folder
#  type "./build.sh" (without the quotes)
#  to compile the .js and .css files into the dist folder.

echo "Building C.js..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Bundle JavaScript files in dependency order
echo "Bundling JavaScript files..."
cat \
	C.js \
	C-Bit.js \
	C-Gate.js \
	C-History.js \
	C-Circuit.js \
	C-AnimatedBeam.js \
	C-Circuit-Editor.js \
	> 'dist/c.js'

# Bundle CSS files
echo "Bundling CSS files..."
cat \
	C.css \
	C-Circuit-Editor.css \
	C-AnimatedBeam.css \
	> 'dist/c.css'

echo "Build complete!"
echo "  - dist/c.js created"
echo "  - dist/c.css created"
