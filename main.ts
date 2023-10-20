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
			let allFiles = app.vault.getFiles();
			
			let vaultSize = allFiles.reduce((a, i) => a + i.stat.size, 0);
			console.log("Vault size: ",vaultSize);
			 //let extensionTotals = {};

			 //// excalidraw files are actually .md files so it requires some work around
 //
			 //files.forEach(file => {
			   //if (file.basename.includes(".excalidraw")) {
				 //if (extensionTotals["excalidraw"]) {
					 //extensionTotals["excalidraw"] += file.stat.size;
				 //} else {
					 //extensionTotals["excalidraw"] = file.stat.size;
				 //}	
			   //}
			   //if (extensionTotals[file.extension]) {
				 //extensionTotals[file.extension] += file.stat.size;
			   //} else {
				 //extensionTotals[file.extension] = file.stat.size;
			   //}
			 //});
			//console.log(extensionTotals);
			function fileTypeReport(dir) {
				let extensionTotals = {};

				// excalidraw files are actually .md files so it requires some work around

				files.forEach(file => {
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
			vaultFileTypeReport = fileTypeReport(allFiles);
			console.log("Vault File Type Report: ",vaultFileTypeReport);

			// allLoadedFiles returns all files and folders, then we check if it is top level
			let allLoadedFiles = app.vault.getAllLoadedFiles() 
			let firstLevelDirs = allLoadedFiles.filter(file => file.children && !file.path.includes("/"));
			testr = fileTypeReport(firstLevelDirs[2]);
			console.log("TEST DIR",testr);

			// call like this: getAllFiles(firstLevelDirs[2])
			function getAllFiles(dir, fileList = []) {
			  dir.children.forEach(child => {
				if (child.children) {
				  getAllFiles(child, fileList);
				} else {
				  fileList.push(child);
				}
			  });
			  return fileList;
			  }
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
	)};

	onunload() {
		//pass
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
