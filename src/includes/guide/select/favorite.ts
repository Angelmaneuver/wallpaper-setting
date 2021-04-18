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
				if (this.installer.isAutoSet === undefined) {
					this.setNextSteps([{
						key:   "SelectFavoriteRegisterType",
						state: { title: this.title + " - Register", guideGroupId: this.guideGroupId + "Register" }
					}]);
				} else if (this.installer.isAutoSet === Constant.wallpaperType.Image) {
					this.setNextSteps([{
						key:   "RegisterFavoriteGuide",
						state: { title: this.title + " - Register - Image wallpaper", guideGroupId: this.guideGroupId + "RegisterImage" },
						args:  [Constant.wallpaperType.Image]
					}]);
				} else {
					this.setNextSteps([{
						key:   "RegisterFavoriteGuide",
						state: { title: this.title + " - Register - Slide wallpaper", guideGroupId: this.guideGroupId + "RegisterSlide" },
						args:  [Constant.wallpaperType.Slide]
					}]);
				}
				break;
			case Constant.favoriteProcess[1]:
				if (this.installer.isAutoSet === undefined) {
					this.setNextSteps([{
						key:   "SelectFavoriteUnRegisterType",
						state: { title: this.title + " - UnRegister", guideGroupId: this.guideGroupId + "UnRegister" }
					}]);
				} else if (this.installer.isAutoSet === Constant.wallpaperType.Image) {
					this.setNextSteps([{
						key:   "UnRegisterFavoriteGuide",
						state: { title: this.title + " - UnRegister - Image wallpaper", guideGroupId: this.guideGroupId + "UnRegisterImage" },
						args:  [Constant.wallpaperType.Image]
					}]);
				} else {
					this.setNextSteps([{
						key:   "UnRegisterFavoriteGuide",
						state: { title: this.title + " - UnRegister - Slide wallpaper", guideGroupId: this.guideGroupId + "UnRegisterSlide" },
						args:  [Constant.wallpaperType.Slide]
					}]);
				}
				break;
			case Constant.favoriteProcess[2]:
				if (this.installer.isAutoSet === undefined) {
					this.setNextSteps([{
						key:   "SelectFavoriteLoadType",
						state: { title: this.title + " - Load", guideGroupId: this.title + " - Load" }
					}]);
				} else if (this.installer.isAutoSet === Constant.wallpaperType.Image) {
					this.setNextSteps([{
						key:   "LoadFavoriteGuide",
						state: { title: this.title + " - Load - Image wallpaper", guideGroupId: this.guideGroupId + "LoadImage" },
						args:  [Constant.wallpaperType.Image]
					}]);
				} else {
					this.setNextSteps([{
						key:   "LoadFavoriteGuide",
						state: { title: this.title + " - Load - Slide wallpaper", guideGroupId: this.guideGroupId + "LoadSlide" },
						args:  [Constant.wallpaperType.Slide]
					}]);
				}
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
