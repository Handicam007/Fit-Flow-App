#!/bin/bash

# Check if a file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <file>"
  exit 1
fi

FILE="$1"

# Check if the file exists
if [ ! -f "$FILE" ]; then
  echo "File $FILE does not exist"
  exit 1
fi

# Create a temporary file
TMP_FILE=$(mktemp)

# Process the file
cat "$FILE" | awk '
BEGIN {
  in_conflict = 0
  keep_line = 1
}

/^<<<<<<< HEAD/ {
  in_conflict = 1
  keep_line = 1
  next
}

/^=======/ {
  if (in_conflict) {
    keep_line = 0
    next
  }
}

/^>>>>>>> / {
  if (in_conflict) {
    in_conflict = 0
    keep_line = 1
    next
  }
}

{
  if (keep_line) {
    print $0
  }
}
' > "$TMP_FILE"

# Replace the original file with the processed file
mv "$TMP_FILE" "$FILE"

echo "Fixed conflicts in $FILE" 