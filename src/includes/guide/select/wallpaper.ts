import { AbstractGuide }                from "../base/abc";
import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import * as Constant                    from "../../constant";

export function delegation2Transition(guide: AbstractGuide, state: State, random?: boolean): void {
	if (state.installer.isAutoSet === undefined) {
		autoSetByFavorite(guide, state, random);
	} else {
		installByType(state, state.installer.isAutoSet);
	}
}

export function autoSetByFavorite(guide: AbstractGuide, state: State, random?: boolean): void {
	if (random && state.settings.favoriteRandomSet.validValue) {
		state.reload = true;
	} else {
		guide.setNextSteps([{ key: "SelectSetupType", state: { title: state.title + " - Select Setup Type" } }]);
	}
}

export function installByType(state: State, type: number): void {
	if (type === Constant.wallpaperType.Image) {
		state.installer.install();
	} else {
		state.installer.installAsSlide();
	}

	state.reload = true;
}

export class SelectSetupType extends AbstractQuickPickSelectGuide {
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
			case this.items[1]:
				return async () => { installByType(
					this.state,
					this.activeItem === this.items[0] ? Constant.wallpaperType.Image : Constant.wallpaperType.Slide);
				};
			default:
				return async () => { this.prev(); };
		}
	}
}
