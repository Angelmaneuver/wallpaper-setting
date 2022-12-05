import {
	window,
	commands,
	ExtensionContext
} from "vscode";
import { ContextManager }    from "./utils/base/context";
import { MultiStepInput }    from "./utils/multiStepInput";
import { State }             from "./guide/base/base";
import { GuideFactory }      from "./guide/factory/base";
import * as Installer        from "./installer";

export async function guidance(context: ExtensionContext): Promise<void> {
	const state = { title: "Wallpaper Setting", resultSet: {} } as Partial<State>;

	try {
		Installer.isInstallable();
		ContextManager.setContext(context);
		const menu = GuideFactory.create("StartMenuGuide", state, context);
		await MultiStepInput.run((input: MultiStepInput) => menu.start(input));
	} catch (e) {
		errorHandling(e);
	}

	if (state.message && state.message.length > 0) {
		window.showInformationMessage(state.message);
	}

	if (state.reload) {
		restart();
	}
}

function errorHandling(e: unknown): void {
	if (e instanceof Error) {
		window.showWarningMessage(e.message);
		console.debug(e);
	}
}

function restart(): void {
	const yes   = 'Yes'
	const items = [yes, 'No']

	window.showInformationMessage(
		`VSCode must be reload window for the settings to take effect. Would you like to reload window now?`,
		...items
	).then(selectAction => {
		if (selectAction === yes) {
			commands.executeCommand('workbench.action.reloadWindow');
		}
	});
}
