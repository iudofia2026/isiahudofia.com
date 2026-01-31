#!/bin/bash

# Script to remove duplicated video autoplay functions

echo "Removing duplicated video autoplay functions..."

# Remove video function from academicindex.html (lines 447-502)
sed -i '' '447,502d' academicindex.html
echo "✓ Removed video autoplay function from academicindex.html (~55 lines)"

# Remove video function from lamcpainting.html (lines 447-502)
sed -i '' '447,502d' lamcpainting.html
echo "✓ Removed video autoplay function from lamcpainting.html (~55 lines)"

# Find and remove from more.html
more_video_line=$(grep -n "Video autoplay and playback rate handling" more.html | head -1 | cut -d: -f1)
if [ ! -z "$more_video_line" ]; then
    # Calculate end line (approximately 55 lines after the function start)
    end_line=$((more_video_line + 54))
    sed -i '' "${more_video_line},${end_line}d" more.html
    echo "✓ Removed video autoplay function from more.html (~55 lines)"
fi

echo "Duplicated video autoplay functions removed successfully!"
echo "Total savings: ~165 lines of code"