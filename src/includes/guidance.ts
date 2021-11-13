import {
	window,
	commands,
	ExtensionContext
} from "vscode";
import { MultiStepInput }    from "./utils/multiStepInput";
import { State }             from "./guide/base/base";
import { GuideFactory }      from "./guide/factory/base";
import * as Installer        from "./installer";

export async function guidance(context: ExtensionContext): Promise<void> {
	const state = { title: "Wallpaper Setting", resultSet: {} } as Partial<State>;

	try {
		Installer.isInstallable();
		const menu = GuideFactory.create("StartMenuGuide", state, context);
		await MultiStepInput.run((input: MultiStepInput) => menu.start(input));
	} catch (e) {
		if (e instanceof Error) {
			window.showWarningMessage(e.message);
			console.debug(e);
		}
	}

	if (state.message && state.message.length > 0) {
		window.showInformationMessage(state.message);
	}

	if (state.reload) {
		commands.executeCommand("workbench.action.reloadWindow");
	}
}
