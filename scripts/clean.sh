#!/bin/bash

echo "🧹 Cleaning Next.js cache and build files..."

# Remove Next.js build directory
rm -rf .next

# Remove node_modules cache
rm -rf node_modules/.cache

# Remove build artifacts
rm -rf out

echo "✅ Clean complete!"
echo ""
echo "Run 'npm run dev' to start fresh"
