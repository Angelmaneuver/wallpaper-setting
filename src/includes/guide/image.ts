import { State }                     from "./base/base";
import { InputResourceGuide, Type }  from "./base/input";
import { BaseGuideEnd }              from "./base/end";
import * as Constant                 from "../constant";
import * as Wallpaper                from "./select/wallpaper";

export class ImageFilePathGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		super(state, Type.File);

		this.itemId = this.itemIds.filePath;
		this.prompt = "Enter the path of the image file you want to set as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right.";
	}

	protected async after(): Promise<void> { return; }
}

export class SetupImageGuideEnd extends BaseGuideEnd {
	protected async after(): Promise<void> {
		await super.lastInputStepExecute();

		Wallpaper.installByType(this.state, Constant.wallpaperType.Image);
	}
}
