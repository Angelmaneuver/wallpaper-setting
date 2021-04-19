import { State }                     from "./base/base";
import { InputResourceGuide, Type }  from "./base/input";

export class ImageFilePathGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		super(state, Type.File);

		this.itemId = this.settingItemId.filePath;
		this.prompt = "Enter the path of the image file you want to set as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right.";
	}
}
