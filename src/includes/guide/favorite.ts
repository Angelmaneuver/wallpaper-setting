import { BaseInputGuide }             from "./base/input";
import { BaseQuickPickGuide }         from "./base/pick";
import { State }                      from "./base/base";
import { QuickPickItem }              from "vscode";
import { BaseValidator }              from "./validator/base";
import { ExtensionSetting, Favorite } from "../settings/extension";
import { VSCodePreset }               from "../utils/base/vscodePreset";
import { Constant }                   from "../constant";

export class RegisterFavoriteGuide extends BaseInputGuide {
	private type: number;

	constructor(
		state: State,
		type:  number
	) {
		state.prompt   = "Enter the name of the favorite setting to be registered.";
		state.validate = BaseValidator.validateRequired;

		super(state);

		this.type      = type;
	}

	public async after(): Promise<void> {
		let favorite: Partial<Favorite>           = {};
		let registeredFavorite: Partial<Favorite> = {};

		if (this.type === Constant.wallpaperType.Image) {
			favorite[this.inputResult] = {
				filePath: this.settings.filePath,
				opacity:  this.settings.opacity
			}
			registeredFavorite         = this.settings.favoriteImageSet;
		} else {
			favorite[this.inputResult] = {
				slideFilePaths:    this.settings.slideFilePaths,
				opacity:           this.settings.opacity,
				slideInterval:     this.settings.slideInterval,
				slideIntervalUnit: this.settings.slideIntervalUnit,
				slideRandomPlay:   this.settings.slideRandomPlay,
				slideEffectFadeIn: this.settings.slideEffectFadeIn
			}
			registeredFavorite         = this.settings.favoriteSlideSet;
		}

		if (Object.keys(registeredFavorite).includes(this.inputResult)) {
			this.state.placeholder = "There is a favorite setting with the same name, do you want to overwrite it?";
			this.setNextSteps(
				this.title + " - Confirm",
				this.guideGroupId,
				0,
				0,
				[{
					key:  "BaseConfirmGuide",
					args: [
						{ yes: "Overwrite", no: "Back to previous."},
						this.registerFavorite,
						this.itemId,
						this.inputResult,
						favorite,
						registeredFavorite
					]
				}],
			);
		} else {
			this.registerFavorite(this.itemId, this.inputResult, favorite, registeredFavorite);
		}
	}

	public async registerFavorite(
		key:                string,
		name:               string,
		favorite:           Partial<Favorite>,
		registeredFavorite: Partial<Favorite>
	): Promise<void> {
		let favorites: Partial<Favorite> = {};

		if (Object.keys(registeredFavorite).length > 0) {
			let temp = { ...registeredFavorite, ...favorite};

			Object.keys(temp).sort().map(
				(key) => {
					favorites[key] = temp[key];
				}
			);
		} else {
			favorites = favorite;
		}

		this.settings.set(key, favorites);

		this.state.message = `Registered ${name} to my favorites!`;
	}
}

export class UnRegisterFavoriteGuide extends BaseQuickPickGuide {
	private static labelling: string = "$(file-media) ";
	private type:             number;
	private returnItem:       QuickPickItem;

	constructor(
		state: State,
		type:  number
	) {
		state.placeholder = "Select the favorite settings to unregister.";

		super(state);

		this.type         = type;
		this.returnItem   = VSCodePreset.create(VSCodePreset.Icons.reply, "Return", "Return without unregister.");

		if (this.type === Constant.wallpaperType.Image) {
			this.items = Object.keys(this.settings.favoriteImageSet).map((label) => ({ label: UnRegisterFavoriteGuide.labelling + label }));
		} else {
			this.items = Object.keys(this.settings.favoriteSlideSet).map((label) => ({ label: UnRegisterFavoriteGuide.labelling + label }));
		}

		this.items        = this.items.concat([this.returnItem]);
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.returnItem) {
			this.prev();
		} else if (this.activeItem) {
			const name                 = this.activeItem.label.replace(UnRegisterFavoriteGuide.labelling, "");
			let   registered: Favorite = {};
			let   favorite:   Favorite = {};

			if (this.type === Constant.wallpaperType.Image) {
				registered = this.settings.favoriteImageSet;
			} else {
				registered = this.settings.favoriteSlideSet;
			}

			Object.keys(registered).map(
				(key) => {
					if (name !== key) {
						favorite[key] = registered[key];
					}
				}
			);

			this.state.placeholder     = "Do you want to unregister it?";
			this.setNextSteps(
				this.title + " - Confirm",
				this.guideGroupId,
				0,
				0,
				[{
					key:  "BaseConfirmGuide",
					args: [
						{ yes: "UnRegister", no: "Back to previous."},
						this.registerFavorite,
						this.itemId,
						name,
						Object.keys(favorite).length > 0 ? favorite : undefined
					]
				}],
			);
		}
	}

	public async registerFavorite(
		key:                string,
		name:               string,
		favorite:           Partial<Favorite> | undefined
	): Promise<void> {
		this.settings.set(key, favorite);

		this.state.message = `UnRegistered ${name} from my favorites!`;
	}
}

export class LoadFavoriteGuide extends BaseQuickPickGuide {
	private static labelling: string = "$(file-media) ";
	private type:             number;
	private returnItem:       QuickPickItem;

	constructor(
		state: State,
		type:  number
	) {
		state.placeholder = "Select the favorite settings to load.";

		super(state);

		this.type         = type;
		this.returnItem   = VSCodePreset.create(VSCodePreset.Icons.reply, "Return", "Return without loading any changes.");

		if (this.type === Constant.wallpaperType.Image) {
			this.items = Object.keys(this.settings.favoriteImageSet).map((label) => ({ label: LoadFavoriteGuide.labelling + label }));
		} else {
			this.items = Object.keys(this.settings.favoriteSlideSet).map((label) => ({ label: LoadFavoriteGuide.labelling + label }));
		}

		this.items        = this.items.concat([this.returnItem]);
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.returnItem) {
			this.prev();
		} else if (this.activeItem) {
			const name = this.activeItem.label.replace(LoadFavoriteGuide.labelling, "");

			if (this.type === Constant.wallpaperType.Image) {
				let favorite = this.settings.favoriteImageSet[name];

				if (favorite["filePath"] && favorite["opacity"]) {
					await this.settings.set(ExtensionSetting.propertyIds.filePath, favorite.filePath);
					await this.settings.set(ExtensionSetting.propertyIds.opacity,  favorite.opacity);
				}

				this.installer.install();
			} else {
				let favorite = this.settings.favoriteSlideSet[name];

				if (
					favorite["slideFilePaths"] &&
					favorite["opacity"] &&
					favorite["slideInterval"] &&
					favorite["slideIntervalUnit"]
				) {
					await this.settings.set(ExtensionSetting.propertyIds.slideFilePaths,    favorite.slideFilePaths);
					await this.settings.set(ExtensionSetting.propertyIds.opacity,           favorite.opacity);
					await this.settings.set(ExtensionSetting.propertyIds.slideInterval,     favorite.slideInterval);
					await this.settings.set(ExtensionSetting.propertyIds.slideIntervalUnit, favorite.slideIntervalUnit);
					await this.settings.set(ExtensionSetting.propertyIds.slideRandomPlay,   favorite.slideRandomPlay     ? favorite.slideRandomPlay   : false);
					await this.settings.set(ExtensionSetting.propertyIds.slideEffectFadeIn, favorite.slideEffectFadeIn   ? favorite.slideEffectFadeIn : false);

					this.installer.installAsSlide();
				}
			}

			this.state.reload = true;
		}
	}
}

export class FavoriteRandomSetGuide extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		state.itemId      = ExtensionSetting.propertyIds.slideEffectFadeIn;
		state.placeholder = "Do you want to set a random wallpaper from your favorite settings at start up?";
		state.items       = Constant.favoriteRandomSet;

		super(state);
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.items[2]) {
			this.prev();
		} else {
			if (this.activeItem === this.items[0]) {
				await this.settings.set(ExtensionSetting.propertyIds.favoriteRandomSet, true);
				this.state.reload = true;
			} else {
				this.settings.remove(ExtensionSetting.propertyIds.favoriteRandomSet);
			}
		}
	}
}
