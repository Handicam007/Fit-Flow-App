#!/bin/bash

# Set the src directory
SRC_DIR="src"

# Find all TypeScript and TSX files recursively in src
echo "Finding all TypeScript files..."
FILES=$(find $SRC_DIR -type f -name "*.ts" -o -name "*.tsx")

# Replace @/ imports with relative paths
echo "Replacing @/ imports with relative paths..."
for FILE in $FILES; do
  # Use sed to replace the imports
  # On macOS, use -i '' for in-place editing
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|from "@/|from "../|g' "$FILE"
    sed -i '' "s|from '@/|from '../|g" "$FILE"
  else
    # On Linux/other, use -i without argument
    sed -i 's|from "@/|from "../|g' "$FILE"
    sed -i "s|from '@/|from '../|g" "$FILE"
  fi
  
  echo "Fixed imports in $FILE"
done

echo "Finished fixing imports!" 