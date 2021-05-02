import * as path            from "path";
import { ExtensionSetting } from "./settings/extension";
import { Wallpaper }        from "./wallpaper";
import { Optional }         from "./utils/base/optional";

export function getInstance(setting: ExtensionSetting): Wallpaper {
	return new Wallpaper(getEntryPoint(), "bootstrap-window.js", setting, "wallpaper-setting");
}

function getEntryPoint(): string {
	return path.dirname(Optional.ofNullable(require.main?.filename).orElseThrow(new URIError("No entry point found...")));
}
