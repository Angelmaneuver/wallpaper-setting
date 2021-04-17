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
					this.setNextSteps(this.title + " - Register", this.guideGroupId + "Register", 0, 0, [{ key: "SelectFavoriteRegisterType" }]);
				} else if (this.installer.isAutoSet === Constant.wallpaperType.Image) {
					this.setNextSteps(
						this.title + " - Register - Image wallpaper",
						this.guideGroupId + "RegisterImage",
						0,
						0,
						[{ key: "RegisterFavoriteGuide", args: [Constant.wallpaperType.Image] }],
					);
				} else {
					this.setNextSteps(
						this.title + " - Register - Slide wallpaper",
						this.guideGroupId + "RegisterSlide",
						0,
						0,
						[{ key: "RegisterFavoriteGuide", args: [Constant.wallpaperType.Slide] }],
					);
				}
				break;
			case Constant.favoriteProcess[1]:
				if (this.installer.isAutoSet === undefined) {
					this.setNextSteps(this.title + " - UnRegister", this.guideGroupId + "UnRegister", 0, 0, [{ key: "SelectFavoriteUnRegisterType" }]);
				} else if (this.installer.isAutoSet === Constant.wallpaperType.Image) {
					this.setNextSteps(
						this.title + " - UnRegister - Image wallpaper",
						this.guideGroupId + "UnRegisterImage",
						0,
						0,
						[{ key: "UnRegisterFavoriteGuide", args: [Constant.wallpaperType.Image] }],
					);
				} else {
					this.setNextSteps(
						this.title + " - UnRegister - Slide wallpaper",
						this.guideGroupId + "UnRegisterSlide",
						0,
						0,
						[{ key: "UnRegisterFavoriteGuide", args: [Constant.wallpaperType.Slide] }],
					);
				}
				break;
			case Constant.favoriteProcess[2]:
				if (this.installer.isAutoSet === undefined) {
					this.setNextSteps(this.title + " - Load", this.guideGroupId + "Load", 0, 0, [{ key: "SelectFavoriteLoadType" }]);
				} else if (this.installer.isAutoSet === Constant.wallpaperType.Image) {
					this.setNextSteps(
						this.title + " - Load - Image wallpaper",
						this.guideGroupId + "LoadImage",
						0,
						0,
						[{ key: "LoadFavoriteGuide", args: [Constant.wallpaperType.Image] }],
					);
				} else {
					this.setNextSteps(
						this.title + " - Load - Slide wallpaper",
						this.guideGroupId + "LoadSlide",
						0,
						0,
						[{ key: "LoadFavoriteGuide", args: [Constant.wallpaperType.Slide] }],
					);
				}
				break;
			case Constant.favoriteProcess[3]:
				this.state.activeItem   = this.settings.favoriteRandomSet ? Constant.favoriteRandomSet[0] : Constant.favoriteRandomSet[1];
				this.setNextSteps(this.title + " - Start up", this.guideGroupId + "Startup", 0, 0, [{ key: "FavoriteRandomSetGuide" }]);
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
					this.setNextSteps(this.title + " - Image wallpaper", this.guideGroupId + "Image", 0, 0, [{ key: "RegisterFavoriteGuide", args: [Constant.wallpaperType.Image] }]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps(this.title + " - Slide wallpaper", this.guideGroupId + "Slide", 0, 0, [{ key: "RegisterFavoriteGuide", args: [Constant.wallpaperType.Slide] }]);
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
					this.setNextSteps(this.title + " - Image wallpaper", this.guideGroupId + "Image", 0, 0, [{ key: "UnRegisterFavoriteGuide", args: [Constant.wallpaperType.Image] }]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps(this.title + " - Slide wallpaper", this.guideGroupId + "Slide", 0, 0, [{ key: "UnRegisterFavoriteGuide", args: [Constant.wallpaperType.Slide] }]);
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
					this.setNextSteps(this.title + " - Image wallpaper", this.guideGroupId + "Image", 0, 0, [{ key: "LoadFavoriteGuide", args: [Constant.wallpaperType.Image] }]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps(this.title + " - Slide wallpaper", this.guideGroupId + "Slide", 0, 0, [{ key: "LoadFavoriteGuide", args: [Constant.wallpaperType.Slide] }]);
					break;
				default:
					this.prev();
					break;
			}
		}
	}
}
