import { commands, ExtensionContext } from "vscode";
import { guidance }                   from "./includes/guidance";
import * as Favorite                  from "./includes/favorite";
import { ContextManager }             from "./includes/utils/base/context";

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerCommand("wallpaper-setting.guidance", () => {
			guidance(context);
		})
	);

	ContextManager.setContext(context);

	Favorite.randomSet();
}

export function deactivate(): void { return }
