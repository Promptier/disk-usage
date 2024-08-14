Aug 14, 2024 Update: I first released this 10 months ago and never touched it since. It's under 100 lines of code to simply aggregate file sizes of existing data you can browse in dev tools, and create a markdown file out of it. It seems quite useful and appears to work as I have not found any issues reported on Github or sent to my email. Over 2 thousand people have downloaded it and that makes me feel good. So if/when I get around to it, I'd like to make it even better. 

Here are my proposed enchancements. First, with an existing report, it appears clicking the button again will not overwrite it, rather, you have to delete it first, then click the button to generate a new report. Overwriting would be nice. Secondly, if say, two months ago, I generated a report which still exists, and I want to create a new one, but compare with the last, well you could simply rename the report, then click the button to have two reports, the old, and the new. Timestamps would be especially nice for this so you know how much things have changed and over what period of time. 

TODO:
- [ ] Make report overwrite old one
- [ ] Add timestamps (date and time) above or below summary

NOTE: I only realized half way in developing this that the size of a file and the disk space it takes up are very different things. Though they are related, I did not consider the metadata of files and directories, such as permissions, modification dates, owners, groups, etc. that your operating system, not Obisidian, takes into account. This will differ across Windows, Linux, and MacOS. Through the use of Obsidian's API alone, only the size of files can be measured, not the actual disk space. So I am considering changing the name. Despite all this, an aggregated count of file sizes of your entire vault, broken down by folders and filetypes is still very handy and comparing the readings to my Linux du (Disk Usage) command, they seemed proportianally accurate. Also keep in mind this does NOT account for the hidden .obsidian folder which contains all your plugins. This folder usually takes up quite alot of space the more plugins you have downloaded. 

This plugin is currently in early development. It's purpose is simple, to manage the file space and size of your vault. Whether you want to know which folder is slowing your loading speed, or you are reaching your size limit for the sync service, this plugin will be helpful in managing your vault.


### Features

##### Show Summary of Vault

<img src="https://github.com/Promptier/disk-usage/assets/143894113/7fa0824c-85b8-4a28-8c84-c799195c51fe">

#### View Total Size of Each File Type and Folder

<img src="https://github.com/Promptier/disk-usage/assets/143894113/efdcfb8b-3b4b-460e-a8af-8f016851a103" width="70%" height="70%">

<img src="https://github.com/Promptier/disk-usage/assets/143894113/25e1acee-7a02-4afc-90c8-b425e5cb3ca8" width="70%" height="70%">

#### Size of File Type by Folders

<img src="https://github.com/Promptier/disk-usage/assets/143894113/09788a6e-d4ab-4576-b598-67cf99ec687f" width="70%" height="70%">

<img src="https://github.com/Promptier/disk-usage/assets/143894113/e8aad93e-2905-4503-ba2c-3c1bd1388904" width="70%" height="70%">

<img src="https://github.com/Promptier/disk-usage/assets/143894113/1d323e4e-c855-4412-8e9c-5807a351b261" width="70%" height="70%">


### How To Use

After installing and enabling this plugin, you will find a `Disk Usage Report` ribbon icon/button on the left of the screen. This will create a markdown file with all the graphs you see above. Once done, you can either save it somewhere or delete it. 

If this plugin doesn't work for some reason, or there is a bug, please email me at jbulfer13@gmail.com or add an issue to the [Github Repo](https://github.com/Promptier/disk-usage/issues). Thanks.
