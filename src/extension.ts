import * as vscode        from 'vscode';
import * as path          from 'path';

import {ExtensionSetting} from './includes/settings/extension';
import {FileSelecter}     from './includes/utils/selector/file';
import {Wallpaper}        from './includes/wallpaper';


export function activate(context: vscode.ExtensionContext) {
	let settings        = new ExtensionSetting();

	let installLocation = () => {
		let result: string | undefined;
		
		if(require.main?.filename) {
			result = require.main?.filename;
			console.debug('Use "require.main?.filename"');
		} else {
			result = process.mainModule?.filename;
			console.debug('Use "process.mainModule?.filename"');
		}
	
		return result ? path.dirname(result) : '';
	};
	
	let installer       = new Wallpaper(
		installLocation(),
		'bootstrap-window.js',
		settings,
		'wallpaper-setting'
	);
	
	let imageSetting    = vscode.commands.registerCommand(
		'wallpaper-setting.imageSelect',
		() => {
			new FileSelecter(
				{
					filters: {
						'Images': ['png', 'jpg', 'jpeg', 'gif']
					}
				}
			).openFileDialog(
				result => {
					if(result.path) {
						settings.filePath = result.path;
						settings.set(
							'filePath',
							result.path
						);
						installer.install();
						vscode.commands.executeCommand('workbench.action.reloadWindow');
					}
				}
			);
		}
	);

	let opacitySetting  = vscode.commands.registerCommand(
		'wallpaper-setting.opacitySet',
		() => {
			vscode.window.showInputBox(
				{
					ignoreFocusOut: true,
					password:       false,
					placeHolder:    '',
					prompt:         'Current Opacity: ' + settings.opacity
				}
			).then(
				(value: string | undefined) => {
					let message: string | null = null;

					if(value && Number.parseFloat(value)) {
						let opacity = Number.parseFloat(value);

						if(opacity <= 1 && opacity >= 0) {
							settings.opacity = opacity;
							settings.set(
								'opacity',
								opacity
							);

							if(settings.filePath) {
								installer.install();
								vscode.commands.executeCommand('workbench.action.reloadWindow');
							}
						} else {
							message = 'Please enter a number between 0 and 1.';
						}
					} else {
						message = 'Please enter a number between 0 and 1.';
					}

					if(message) {
						vscode.window.showInformationMessage(message);
					}
				}
			);
		}
	);

	let install         = vscode.commands.registerCommand(
		'wallpaper-setting.install',
		() => {
			if(settings.filePath) {
				installer.install();
				vscode.commands.executeCommand('workbench.action.reloadWindow');
			}
		}
	);

	let uninstall       = vscode.commands.registerCommand(
		'wallpaper-setting.uninstall',
		() => {
			installer.uninstall();
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	);

	let uninstallAll    = vscode.commands.registerCommand(
		'wallpaper-setting.uninstallAll',
		() => {
			installer.uninstall();
			settings.uninstall();
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	);

	context.subscriptions.push(imageSetting);
	context.subscriptions.push(opacitySetting);
	context.subscriptions.push(install);
	context.subscriptions.push(uninstall);
	context.subscriptions.push(uninstallAll);
}

export function deactivate() {}
