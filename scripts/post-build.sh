#!/bin/bash

# Post-build script to add "use client" directive to React package
echo "Adding 'use client' directive to @suggesto/react package..."

# Add "use client" to the beginning of both CJS and ESM files
sed -i '' '1s/^/"use client";\n/' packages/react/dist/index.mjs
sed -i '' '1s/^/"use client";\n/' packages/react/dist/index.js

echo "✅ Successfully added 'use client' directive to React package files"
