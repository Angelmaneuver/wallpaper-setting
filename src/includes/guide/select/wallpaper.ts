import { AbstractGuide }                from "../base/abc";
import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import {
	messages,
	words,
	quickpicks,
	types,
}                                       from "../../constant";

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
		guide.setNextSteps([{ key: "SelectSetupType", state: { title: state.title + words.headline.wallpaper } }]);
	}
}

export function installByType(state: State, type: number): void {
	if (types.wallpaper.image === type) {
		state.installer.install();
	} else {
		state.installer.installAsSlide();
	}

	state.reload = true;
}

export class SelectSetupType extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.placeholder = messages.placeholder.wallpaper;
		this.items       = quickpicks.wallpaper;
	}

	public getExecute(): () => Promise<void> {
		switch (this.activeItem) {
			case this.items[0]:
			case this.items[1]:
				return async () => { installByType(
					this.state,
					this.activeItem === this.items[0] ? types.wallpaper.image : types.wallpaper.slide);
				};
			default:
				return async () => { this.prev(); };
		}
	}
}
