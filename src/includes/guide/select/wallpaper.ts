import { AbstractGuide }          from "../base/abc";
import { AbstractQuickPickGuide } from "../base/pick";
import { State }                  from "../base/base";
import * as Constant              from "../../constant";

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

export class SelectSetupType extends AbstractQuickPickGuide {
	public init(): void {
		super.init();

		this.placeholder = "Select the type of wallpaper you want to set.";
		this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
			item1:  "Set an image to wallpaper.",
			item2:  "Set an image slide to wallpaper.",
			return: "Back to previous."
		});
	}

	public getExecute(): () => Promise<void> {
		switch (this.activeItem) {
			case this.items[0]:
				return async () => { this.installer.install(); this.state.reload = true; }
			case this.items[1]:
				return async () => { this.installer.installAsSlide(); this.state.reload = true; }
			default:
				return async () => { this.prev(); }
		}
	}
}
