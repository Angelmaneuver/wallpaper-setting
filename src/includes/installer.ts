import * as path            from "path";
import { ExtensionSetting } from "./settings/extension";
import { Wallpaper }        from "./wallpaper";

export function getInstance(setting: ExtensionSetting): Wallpaper {
	return new Wallpaper(
		(
			() => {
				const entryPoint = require.main?.filename;
				
				if (entryPoint) {
					return path.dirname(entryPoint);
				} else {
					throw new URIError("No entry point found...");
				}
			}
		)(),
		"bootstrap-window.js",
		setting,
		"wallpaper-setting"
	);
}
