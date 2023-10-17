#!/bin/bash

#create key values of folder names and size in kilobytes
declare -A myArray
while read -r number name; do
  myArray["$name"]=$number
done < <(du -d 1 ../../../ | sed 's|[/]||g' | sed 's/\.\{2,\}//g' | grep -v 'obsidian' | head -n -1)

# Print the array
#for key in "${!myArray[@]}"; do
  #echo "key: ${key}, value: ${myArray[${key}]}"
#done

echo '```mermaid' > folders.md
echo 'pie title Disk Usage by Folder' >> folders.md

# Add pie chart data to Markdown file
for key in "${!myArray[@]}"; do
  echo "    \"$key\" : ${myArray[$key]}" >> folders.md
done

# Close mermaid code block
echo '```' >> folders.md



