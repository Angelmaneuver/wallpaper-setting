import { State }                     from "./base/base";
import { InputResourceGuide, Type }  from "./base/input";
import { ExtensionSetting }          from "../settings/extension";

export class ImageFilePathGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		state.itemId = ExtensionSetting.propertyIds.filePath;
		state.prompt = "Enter the path of the image file you want to set as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right.";

		super(state, Type.File);
	}
}
