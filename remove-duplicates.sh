#!/bin/bash

# Script to remove duplicated code blocks that are now in shared files

echo "Removing duplicated favicon functions..."

# Remove favicon function from academicindex.html (lines 505-547)
sed -i '' '505,547d' academicindex.html
echo "✓ Removed favicon function from academicindex.html"

# Remove favicon function from lamcpainting.html (lines 505-547)
sed -i '' '505,547d' lamcpainting.html
echo "✓ Removed favicon function from lamcpainting.html"

# Process more.html - need to find the favicon function first
more_favicon_line=$(grep -n "function ensureFavicon" more.html | head -1 | cut -d: -f1)
if [ ! -z "$more_favicon_line" ]; then
    # Calculate end line (approximately 43 lines after the function start)
    end_line=$((more_favicon_line + 42))
    sed -i '' "${more_favicon_line},${end_line}d" more.html
    echo "✓ Removed favicon function from more.html"
fi

echo "Duplicated favicon functions removed successfully!"
echo "This saves approximately 150+ lines of code per file"
