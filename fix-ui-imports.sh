#!/bin/bash

# Set the UI components directory
UI_DIR="src/components/ui"

# Find all TypeScript and TSX files recursively in ui directory
echo "Finding all UI component files..."
FILES=$(find $UI_DIR -type f -name "*.ts" -o -name "*.tsx")

# Replace import paths for utils
echo "Replacing import paths for utils..."
for FILE in $FILES; do
  # Use sed to replace the imports
  # On macOS, use -i '' for in-place editing
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|import { cn } from "../lib/utils"|import { cn } from "../../lib/utils"|g' "$FILE"
  else
    # On Linux/other, use -i without argument
    sed -i 's|import { cn } from "../lib/utils"|import { cn } from "../../lib/utils"|g' "$FILE"
  fi
  
  echo "Fixed imports in $FILE"
done

echo "Finished fixing UI component imports!" 