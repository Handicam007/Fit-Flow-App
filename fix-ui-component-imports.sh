#!/bin/bash

# Set the UI components directory
UI_DIR="src/components/ui"

# Find all TypeScript and TSX files recursively in UI directory
echo "Finding all UI component files..."
FILES=$(find $UI_DIR -type f -name "*.ts" -o -name "*.tsx")

# Replace import paths for UI components
echo "Replacing import paths for UI components..."
for FILE in $FILES; do
  # Use sed to replace the imports
  # On macOS, use -i '' for in-place editing
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|from "../components/ui/|from "./|g' "$FILE"
  else
    # On Linux/other, use -i without argument
    sed -i 's|from "../components/ui/|from "./|g' "$FILE"
  fi
  
  echo "Fixed imports in $FILE"
done

echo "Finished fixing UI component imports!" 