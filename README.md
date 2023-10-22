This plugin is currently in early development. It's purpose is simple, to manage the file space and size of your vault. Whether you want to know which folder is slowing your loading speed, or you are reaching your size limit for the sync service, this plugin will be helpful in managing your vault.

UPDATE: All the bash/shell scripts are now deprecated and I am now rewriting this is Typescript and using Obsidian's own API. I realized otherwise I would have to rewrite the scripts in Powershell for windows, and figure out some odd solution for mobile. Not to mention to security concerns of requiring `sudo` for the `du` (disk usage) command, which the bash scripts rely on. Using Obsidian's API and all their built in methods is the clear answer and is crossplatform in it's nature. Despite not longer needing the them, I will keep the bash scripts here for now becuase I think they are cool.

### Features

##### Track Folders
```mermaid
pie title Disk Usage by Folder
    "Software" : 964
    "Daily" : 12
    "Professional" : 188
    "Academic" : 520
    "Personal" : 228
    "todo" : 364
```
##### Track Plugins
```mermaid
pie title Disk Usage by Plugin
    "obsidian-excalidraw-plugin" : 2780
    "settings-search" : 32
    "obsidian-discordrpc" : 220
    "obsidian-full-calendar" : 2492
    "disk-usage" : 32
    "obsidian-hider" : 68
```
##### Track Filetypes
```mermaid
pie title Disk Usage by File Type
    ".md" : 5.7
    ".jpg" : 1.2
    ".pdf" : 3.2
```
