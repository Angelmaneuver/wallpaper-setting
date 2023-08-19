import { State }                     from "./base/base";
import { InputResourceGuide, Type }  from "./base/input";
import { BaseGuideEnd }              from "./base/end";
import { messages, types }           from "../constant";
import * as Wallpaper                from "./select/wallpaper";

export class ImageFilePathGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		super(state, Type.File);

		this.itemId = this.itemIds.filePath;
		this.prompt = messages.placeholder.image;
	}
}

export class SetupImageGuideEnd extends BaseGuideEnd {
	protected async after(): Promise<void> {
		await super.lastInputStepExecute();

		Wallpaper.installByType(this.state, types.wallpaper.image);
	}
}
