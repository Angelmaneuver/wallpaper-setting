import {commands, ExtensionContext} from 'vscode';

import {guidance}                   from './includes/guidance';


export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand(
			'wallpaper-setting.guidance',
			() => {
				guidance(context);
			}
		)
	);
}

export function deactivate() {}
