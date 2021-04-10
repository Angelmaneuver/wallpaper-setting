import { State }                     from "./base/base";
import { InputResourceGuide, Type }  from "./base/input";

export class ImageFilePathGuide extends InputResourceGuide {
	public static itemId = "filePath";

	constructor(
		state: State,
	) {
		state.itemId = ImageFilePathGuide.itemId;
		state.prompt = "Enter the path of the image file you want to set as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right.";

		super(state, Type.File);
	}
}
