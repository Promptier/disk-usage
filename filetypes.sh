#!/bin/bash
#markdown=`find ../../../ -iname '*.md' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "md $markdown"
#png=`find ../../../ -iname '*.png' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "png $png"
#jpg=`find ../../../ -iname '*.jpg' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "jpg $jpg"
#jpeg=`find ../../../ -iname '*.jpeg' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "jpeg $jpeg"
#excalidraw=`find ../../../ -iname '*.excalidraw*' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "excalidraw $excalidraw"
#webm=`find ../../../ -iname '*.webm*' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "webm $webm"
#pdf=`find ../../../ -iname '*.pdf*' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "pdf $pdf"
#gif=`find ../../../ -iname '*.gif*' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "gif $gif"
#svg=`find ../../../ -iname '*.svg*' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "svg $svg"
#json=`find ../../../ -iname '*.json*' -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}'`
#echo "json $json"
#
#
#declare -A fileTypes
#
#for ext in md png jpg jpeg excalidraw webm pdf gif svg json; do
  #size=$(find ../../../ -iname "*.$ext" -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}')
  #fileTypes["$ext"]=$size
#done
 #
## Start writing to Markdown file
#echo '```mermaid' > filetypes.md
#echo 'pie title Disk Usage by Filetype' >> filetypes.md
#
## Add pie chart data to Markdown file
#for key in "${!fileTypes[@]}"; do
  #echo "    \"$key\" : ${fileTypes[$key]}" >> filetypes.md
#done
#
## Close mermaid code block
#echo '```' >> filetypes.md

#!/bin/bash
declare -A fileTypes

# Populate associative array
for ext in md png jpg jpeg excalidraw webm pdf gif svg json; do
  size=$(find ../../../ -iname "*.$ext" -print0 | du -c --files0-from=- | tail -1 | awk '{print $1}')
  if [ "$size" -gt 0 ]; then
    fileTypes["$ext"]=$size
  fi
done

# Start writing to Markdown file
echo '```mermaid' > filetypes.md
echo 'pie title Disk Usage by Filetype' >> filetypes.md

# Add pie chart data to Markdown file
for key in "${!fileTypes[@]}"; do
  if [ "${fileTypes[$key]}" -gt 0 ]; then
    echo "    \"$key\" : ${fileTypes[$key]}" >> filetypes.md
  fi
done

# Close mermaid code block
echo '```' >> filetypes.md

#GPT
declare -A fileTypesH

# Create Markdown file and write table header
echo "" >> filetypes.md
echo "|Folder|Size|" >> filetypes.md
echo "|-|-|" >> filetypes.md

# Populate associative array and write to Markdown file
while read -r size folder; do
  fileTypesH["$folder"]=$size
  echo "|$folder|$size|" >> filetypes.md
done < <(du -h -d 1 ../../../ | grep -v "obsidian" | sed '$d' | sed 's|[/]||g' | sed 's/\.\{2,\}//g')
