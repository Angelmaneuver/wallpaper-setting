import { AbstractGuide }      from "../base/abc";
import { BaseQuickPickGuide } from "../base/pick";
import { State }              from "../base/base";
import { VSCodePreset }       from "../../utils/base/vscodePreset";
import * as Constant          from "../../constant";

export function delegation2Transition(guide: AbstractGuide, state: State, random?: boolean,) {
	if (state.installer.isAutoSet === undefined) {
		autoSetByFavorite(guide, state, random);
	} else {
		autoSetByInstaller(state);
	}
}

export function autoSetByFavorite(guide: AbstractGuide, state: State, random?: boolean,) {
	if (random && state.settings.favoriteRandomSet.validValue) {
		state.reload = true;
	} else {
		guide.setNextSteps([{ key: "SelectSetupType", state: { title: state.title + " - Select Setup Type" } }]);
	}
}

export function autoSetByInstaller(state: State) {
	if (state.installer.isAutoSet === Constant.wallpaperType.Image) {
		state.installer.install();
	} else {
		state.installer.installAsSlide();
	}

	state.reload = true;
}

export class SelectSetupType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to set.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  "Set an image to wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  "Set an image slide to wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Back to previous."),
		];

		super(state);
	}

	public async after(): Promise<void> {
		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.installer.install();
					this.state.reload = true;
					break;
				case this.items[1]:
					this.installer.installAsSlide();
					this.state.reload = true;
					break;
				default:
					this.prev();
					break;
			}
		}
	}
}
