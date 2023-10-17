#!/bin/bash

#create key values of folder names and size in kilobytes

declare -A myArray
while read -r number name; do
  myArray["$name"]=$number
done < <(du -d 1 ../ | sed 's|[/]||g' | sed 's/\.\{2,\}//g' | head -n -1)

for key in "${!myArray[@]}"; do
  echo "key: ${key}, value: ${myArray[${key}]}"
done

echo '```mermaid' > plugins.md
echo 'pie title Disk Usage by Plugin' >> plugins.md

# Add pie chart data to Markdown file
for key in "${!myArray[@]}"; do
  echo "    \"$key\" : ${myArray[$key]}" >> plugins.md
done

# Close mermaid code block
echo '```' >> plugins.md

