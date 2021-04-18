import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseQuickPickGuide }        from "../base/pick";
import { State }                     from "../base/base";
import { VSCodePreset }              from "../../utils/base/vscodePreset";
import { Constant }                  from "../../constant";

export class SelectFavoriteProcess extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the process you want to perform.";

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.items =
			[Constant.favoriteProcess[0]]
			.concat(this.settings.isRegisterd ? [Constant.favoriteProcess[1], Constant.favoriteProcess[2], Constant.favoriteProcess[3]] : [])
			.concat([Constant.favoriteProcess[4]]);

		await super.show(input);
	}

	public async after(): Promise<void> {
		switch (this.activeItem) {
			case Constant.favoriteProcess[0]:
				this.setTransition("Register");
				break;
			case Constant.favoriteProcess[1]:
				this.setTransition("UnRegister");
				break;
			case Constant.favoriteProcess[2]:
				this.setTransition("Load");
				break;
			case Constant.favoriteProcess[3]:
				this.state.activeItem   = this.settings.favoriteRandomSet ? Constant.favoriteRandomSet[0] : Constant.favoriteRandomSet[1];
				this.setNextSteps([{
					key:   "FavoriteRandomSetGuide",
					state: { title: this.title + " - Start up", guideGroupId: this.guideGroupId + "Startup" }
				}]);
				break;
			default:
				this.prev();
				break;
		}
	}

	private setTransition(key: string): void {
		if (this.installer.isAutoSet === undefined) {
			this.setNextSteps([{
				key:   `SelectFavorite${key}Type`,
				state: { title: `${this.title} - ${key}`, guideGroupId: `${this.guideGroupId}${key}` }
			}]);
		} else {
			let typeName = Object.keys(Constant.wallpaperType).filter(
				(key) => {
					return Constant.wallpaperType[key] === this.installer.isAutoSet;
				}
			)[0];

			this.setNextSteps([{
				key:   `${key}FavoriteGuide`,
				state: { title: `${this.title} - ${key} - ${typeName} wallpaper`, guideGroupId: `${this.guideGroupId}${key}${typeName}` },
				args:  [this.installer.isAutoSet]
			}]);
		}
	}
}

export class SelectFavoriteRegisterType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to register for favorite.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  "Register to favorite the current wallpaper image settings."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  "Register to favorite the current wallpaper slide settings."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Return without saving any changes."),
		];

		super(state);
	}

	public async after(): Promise<void> {
		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.state.itemId = "favoriteWallpaperImageSet";
					this.setNextSteps([{
						key:   "RegisterFavoriteGuide",
						state: { title: this.title + " - Image wallpaper", guideGroupId: this.guideGroupId + "Image" },
						args:  [Constant.wallpaperType.Image]
					}]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps([{
						key:   "RegisterFavoriteGuide",
						state: { title: this.title + " - Slide wallpaper", guideGroupId: this.guideGroupId + "Slide" },
						args:  [Constant.wallpaperType.Slide]
					}]);
					break;
				default:
					this.prev();
					break;
			}
		}
	}
}

export class SelectFavoriteUnRegisterType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to unregister for favorite.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  "UnRegister the wallpaper image setting from favorite."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  "UnRegister the wallpaper slide setting from favorite."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Return without saving any changes."),
		];

		super(state);
	}

	public async after(): Promise<void> {
		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.state.itemId = "favoriteWallpaperImageSet";
					this.setNextSteps([{
						key:   "UnRegisterFavoriteGuide",
						state: { title: this.title + " - Image wallpaper", guideGroupId: this.guideGroupId + "Image" },
						args:  [Constant.wallpaperType.Image]
					}]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps([{
						key:   "UnRegisterFavoriteGuide",
						state: { title: this.title + " - Slide wallpaper", guideGroupId: this.guideGroupId + "Slide" },
						args:  [Constant.wallpaperType.Slide]
					}]);
					break;
				default:
					this.prev();
					break;
			}
		}
	}
}

export class SelectFavoriteLoadType extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.placeholder = "Select the type of wallpaper you want to load.";
		state.items       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  "Load wallpaper image settings from favorites."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  "Load wallpaper slide settings from favorites."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Return without loading any changes."),
		];

		super(state);
	}

	public async after(): Promise<void> {
		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.state.itemId = "favoriteWallpaperImageSet";
					this.setNextSteps([{
						key:   "LoadFavoriteGuide",
						state: { title: this.title + " - Image wallpaper", guideGroupId: this.guideGroupId + "Image" },
						args:  [Constant.wallpaperType.Image]
					}]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps([{
						key:   "LoadFavoriteGuide",
						state: { title: this.title + " - Slide wallpaper", guideGroupId: this.guideGroupId + "Slide" },
						args:  [Constant.wallpaperType.Slide]
					}]);
					break;
				default:
					this.prev();
					break;
			}
		}
	}
}
