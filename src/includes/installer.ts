import * as path            from "path";
import { env }              from "vscode";
import { ExtensionSetting } from "./settings/extension";
import { Wallpaper }        from "./wallpaper";
import { Optional }         from "./utils/base/optional";
import { File }             from "./utils/base/file";

export function isInstallable(): void {
	const targetPath = path.join(getEntryPoint(), "bootstrap-window.js");

	try {
		File.isWritable([targetPath]);
	} catch (e) {
		if (e instanceof Error) {
			throw new Error(`You don't have permission to write to the file required to run this extension. Please check the permission on "${targetPath}".`);
		}
	}
}

export function getInstance(setting: ExtensionSetting): Wallpaper {
	return new Wallpaper(getEntryPoint(), "bootstrap-window.js", setting, "wallpaper-setting");
}

function getEntryPoint(): string {
	return path.join(Optional.ofNullable(env.appRoot).orElseThrow(new URIError("Entry point not found...")), "out");
}
