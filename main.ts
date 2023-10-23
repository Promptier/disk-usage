import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface diskUsageSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: diskUsageSettings = {
	mySetting: 'default'
}

export default class diskUsagePlugin extends Plugin {
	settings: diskUsageSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('pdf-file', 'Disk Usage Report', (evt: MouseEvent) => {
			new Notice('Generating report');

			// THREE GENERAL FUNCTIONS

			function getAllFiles(dir, fileList = []) {
				if (!Array.isArray(fileList)) {
				console.error('fileList must be an array');
				return;
			    }
			  dir.children.forEach(child => {
				if (child.children) {
				  getAllFiles(child, fileList);
				} else {
				  fileList.push(child);
				}
			  });
			  return fileList;
			  }
			
			// returns an object with key as name of extension/file type and value as size in bytes
			function fileTypeReport(dirs) {
				let extensionTotals = {};

				// excalidraw files are actually .md files so it requires some work around
				dirs.forEach(file => {
				  if (file.basename.includes(".excalidraw")) {
					if (extensionTotals["excalidraw"]) {
						extensionTotals["excalidraw"] += file.stat.size;
					} else {
						extensionTotals["excalidraw"] = file.stat.size;
					}	
				  }
				  if (extensionTotals[file.extension]) {
					extensionTotals[file.extension] += file.stat.size;
				  } else {
					extensionTotals[file.extension] = file.stat.size;
				  }
				});
				return extensionTotals;
			}
			// MUST BE AN ARRAY OF FILES, use getAllFiles() before getSize(), except for app.vault.getfiles(), which already returns just files, everything else return objects, we have to use getAllFiles() to dig through these objects
			function getSize(arr) {
				return arr.reduce((a, i) => a + i.stat.size, 0);
			}

			let allFiles = this.app.vault.getFiles();
			let vaultSize = getSize(allFiles); // in bytes
			let vaultSizeMB = (vaultSize/1000000).toFixed(2); //two decimal points

			let allLoadedFiles = this.app.vault.getAllLoadedFiles() 
			let firstLevelDirs = allLoadedFiles.filter(file => file.children && !file.path.includes("/"));
			let firstLevelDirFiles = firstLevelDirs.reduce((acc, dir) => {
			  acc[dir.name] = getAllFiles(dir);
			  return acc;
			}, {});
			let firstLevelDirSize = {};
			Object.keys(firstLevelDirFiles).forEach(key => {
				let size = getSize(firstLevelDirFiles[key])
				  firstLevelDirSize[key] = size;
			});

			let vaultReport = fileTypeReport(allFiles);

			let sortedFolderSizes = Object.entries(firstLevelDirSize).sort((a, b) => b[1] - a[1]);
			let mostUsedFolder = sortedFolderSizes[0][0];
			let secondMostUsedFolder = sortedFolderSizes[1][0];


			let sortedFileTypeSizes = Object.keys(vaultReport).sort((a, b) => vaultReport[b] - vaultReport[a]);
			let mostUsedFileType = sortedFileTypeSizes[0].toUpperCase();
			let secondMostUsedFileType = sortedFileTypeSizes[1].toUpperCase();

			let vaultName = this.app.vault.getName()
			let reportBrief = `>[!abstract] Summary\nTotal space taken up in ${vaultName} is ${vaultSizeMB}MB. ${mostUsedFileType} files take up the most space followed by ${secondMostUsedFileType} files. Largest folder is ${mostUsedFolder} followed by ${secondMostUsedFolder}. Keep in mind this does not include your hidden .obsidian folder and plugins.\n\n## Vault Total\n`;

			let vaultReportBrief = "```mermaid\npie title Total Disk Usage by Filetype\n"


			let folderSizeReportBrief = "```mermaid\npie title Total Disk Usage by Folder\n"
			Object.keys(firstLevelDirSize).forEach(key => {
				folderSizeReportBrief += `\t"${key}" : ${firstLevelDirSize[key]}\n`;
			});
			folderSizeReportBrief += "```\n\n"


			let reportByFolder = firstLevelDirs.reduce((acc, dir) => {
			  const dirFiles = getAllFiles(dir);
			  const report = fileTypeReport(dirFiles);
			  acc[dir.name] = report;
			  return acc;
			}, {});
			Object.keys(vaultReport).forEach(key => {
				vaultReportBrief += `\t"${key}" : ${vaultReport[key]}\n`;
			});
			let foldersReportBrief = "## Folder By Filetype\n"
			Object.keys(reportByFolder).forEach(key => {
				let tmp = `\`\`\`mermaid\npie title ${key}\n`
				Object.keys(reportByFolder[key]).forEach(k => {
					tmp +=  `\t"${k}" : ${reportByFolder[key][k]}\n`
				});
				tmp += "```\n\n";
				foldersReportBrief += tmp;
			});
			vaultReportBrief += "```\n"
			let finalReport = reportBrief + vaultReportBrief + folderSizeReportBrief + foldersReportBrief	
			this.app.vault.create("Disk Usage Report.md",finalReport);

		});
	};

	onunload() {
		//pass
		//since there were no event listeners or anything similar it seemed there was not anythin to unload
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

