import { commands, ExtensionContext } from "vscode";
import { guidance }                   from "./includes/guidance";
import * as Favorite                  from "./includes/favorite";

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerCommand("wallpaper-setting.guidance", () => {
			guidance(context);
		})
	);

	Favorite.randomSet();
}

export function deactivate(): void { return }
