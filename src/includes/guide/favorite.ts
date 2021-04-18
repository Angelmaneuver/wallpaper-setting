import { BaseInputGuide }             from "./base/input";
import { BaseQuickPickGuide }         from "./base/pick";
import { State }                      from "./base/base";
import { QuickPickItem }              from "vscode";
import { BaseValidator }              from "./validator/base";
import { ExtensionSetting, Favorite } from "../settings/extension";
import { VSCodePreset }               from "../utils/base/vscodePreset";
import { Constant }                   from "../constant";

async function registFavorite(
	key:        string,
	state:      State,
	message:    string,
	favorite1:  Partial<Favorite>,
	favorite2?: Partial<Favorite>
): Promise<void> {
	let favorites: Partial<Favorite> = {};

	if (favorite2 && Object.keys(favorite2).length > 0) {
		let temporary = { ...favorite2, ...favorite1};

		Object.keys(temporary).sort().map((key) => { favorites[key] = temporary[key]; });
	} else {
		favorites = favorite1;
	}

	state.settings.set(key, favorites);
	state.message = message;
}

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
		const [favorite, registered] = this.createRegistFavorite();
		const message                = `Registered ${this.inputResult} to my favorites!`;

		if (Object.keys(registered).includes(this.inputResult)) {
			this.state.placeholder = "There is a favorite setting with the same name, do you want to overwrite it?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title + " - Confirm", guideGroupId: this.guideGroupId },
				args:  [{ yes: "Overwrite.", no: "Back to previous." }, registFavorite, this.itemId, this.state, message, favorite, registered]
			}]);
		} else {
			registFavorite(this.itemId, this.state, message, favorite, registered);
		}
	}

	private createRegistFavorite(): Partial<Favorite>[] {
		let favorite:   Partial<Favorite> = {};
		let registered: Partial<Favorite> = {};

		if (this.type === Constant.wallpaperType.Image) {
			favorite[this.inputResult] = {
				filePath: this.settings.filePath,
				opacity:  this.settings.opacity
			}
			registered                 = this.settings.favoriteImageSet;
		} else {
			favorite[this.inputResult] = {
				slideFilePaths:    this.settings.slideFilePaths,
				opacity:           this.settings.opacity,
				slideInterval:     this.settings.slideInterval,
				slideIntervalUnit: this.settings.slideIntervalUnit,
				slideRandomPlay:   this.settings.slideRandomPlay,
				slideEffectFadeIn: this.settings.slideEffectFadeIn
			}
			registered                 = this.settings.favoriteSlideSet;
		}

		return [favorite, registered];
	}
}

class BaseRegistedFavoriteOperationGuide extends BaseQuickPickGuide {
	protected static labelling: string = "$(file-media) ";
	protected type:             number;
	protected returnItem:       QuickPickItem;

	constructor(
		state:       State,
		type:        number,
		description: { returnItem: string }
	) {
		super(state);

		this.type       = type;
		this.returnItem = VSCodePreset.create(VSCodePreset.Icons.reply, "Return", description.returnItem);

		if (this.type === Constant.wallpaperType.Image) {
			this.items = Object.keys(this.settings.favoriteImageSet).map((label) => ({ label: BaseRegistedFavoriteOperationGuide.labelling + label }));
		} else {
			this.items = Object.keys(this.settings.favoriteSlideSet).map((label) => ({ label: BaseRegistedFavoriteOperationGuide.labelling + label }));
		}

		this.items      = this.items.concat([this.returnItem]);
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.returnItem) {
			this.prev();
		}
	}

	protected get activeItemLabel(): string {
		return this.activeItem ? this.activeItem.label.replace(BaseRegistedFavoriteOperationGuide.labelling, "") : "";
	}
}

export class UnRegisterFavoriteGuide extends BaseRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  number
	) {
		state.placeholder = "Select the favorite settings to unregister.";

		super(state, type, { returnItem: "Return without unregister." });
	}

	public async after(): Promise<void> {
		super.after();

		if (this.activeItem) {
			const name                 = this.activeItemLabel;
			const message              = `UnRegistered ${name} from my favorites!`;
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

			this.state.placeholder = "Do you want to unregister it?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title + " - Confirm", guideGroupId: this.guideGroupId },
				args:  [
					{ yes: "UnRegister.", no: "Back to previous." },
					registFavorite,
					this.itemId,
					this.state,
					message,
					(Object.keys(favorite).length > 0 ? favorite : undefined)
				]
			}]);
		}
	}
}

export class LoadFavoriteGuide extends BaseRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  number
	) {
		state.placeholder = "Select the favorite settings to load.";

		super(state, type, { returnItem: "Return without loading any changes." });
	}

	public async after(): Promise<void> {
		super.after();

		if (this.activeItem) {
			const name = this.activeItemLabel;

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
