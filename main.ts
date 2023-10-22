import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

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

			// MUST BE AN ARRAY OF FILES, use getAllFiles() before getSize(), except for app.vault.getfiles(), which already returns just files, everything else return objects, we have to use getAllFiles() to dig through these objects
			}
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
			console.log(firstLevelDirSize);

			let vaultReport = fileTypeReport(allFiles);

			let sortedFolderSizes = Object.entries(firstLevelDirSize).sort((a, b) => b[1] - a[1]);
			//let sortedFolderSizes = Object.keys(firstLevelDirSize).sort((a, b) => vaultReport[b] - vaultReport[a]);
			console.log("FOLDERS",sortedFolderSizes);
			let mostUsedFolder = sortedFolderSizes[0][0];
			let secondMostUsedFolder = sortedFolderSizes[1][0];


			let sortedFileTypeSizes = Object.keys(vaultReport).sort((a, b) => vaultReport[b] - vaultReport[a]);
			let mostUsedFileType = sortedFileTypeSizes[0].toUpperCase();
			let secondMostUsedFileType = sortedFileTypeSizes[1].toUpperCase();

			let vaultName = this.app.vault.getName()
			let reportBrief = `>[!abstract] Summary\nTotal space taken up in ${vaultName} is ${vaultSizeMB}MB. ${mostUsedFileType} files take up the most space followed by ${secondMostUsedFileType} files. Largest folder is ${mostUsedFolder} followed by ${secondMostUsedFolder}. Keep in mind this does not include you hidden .obsidian folder and plugins.\n\n## Vault Total\n`;

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
				//console.log(title);
				//console.log(reportByFolder[key]);
				Object.keys(reportByFolder[key]).forEach(k => {
					tmp +=  `\t"${k}" : ${reportByFolder[key][k]}\n`
					//(k,reportByFolder[key][k]);
				});
				tmp += "```\n\n";
				//console.log(tmp);
				foldersReportBrief += tmp;
			});
			vaultReportBrief += "```\n"
			let finalReport = reportBrief + vaultReportBrief + folderSizeReportBrief + foldersReportBrief	
			this.app.vault.create("finalReport.md",finalReport);

		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
