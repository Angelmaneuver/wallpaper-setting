import { BaseInputGuide }             from "./base/input";
import { BaseQuickPickGuide }         from "./base/pick";
import { State }                      from "./base/base";
import { QuickPickItem }              from "vscode";
import { BaseValidator }              from "./validator/base";
import { ExtensionSetting, Favorite } from "../settings/extension";
import { VSCodePreset }               from "../utils/base/vscodePreset";
import * as Constant                  from "../constant";

async function registFavorite(
	key:        string,
	state:      State,
	message:    string,
	favorites:  {
		favorite: Partial<Favorite>,
		option?:  Partial<Favorite>
	}
): Promise<void> {
	let registFavorite: Partial<Favorite> = {};

	if (favorites.option && Object.keys(favorites.option).length > 0) {
		let temporary = { ...favorites.option, ...favorites.favorite};

		Object.keys(temporary).sort().map((key) => { registFavorite[key] = temporary[key]; });
	} else {
		registFavorite = favorites.favorite;
	}

	state.settings.setItemValue(key, registFavorite);

	state.message = message;
}

async function removeFavorite(
	key:        string,
	state:      State,
	message:    string,
): Promise<void> {
	state.settings.setItemValue(key, undefined);

	state.message = message;
}

export class RegisterFavoriteGuide extends BaseInputGuide {
	private type: number;

	constructor(
		state: State,
		type:  number
	) {
		super(state);

		this.type      = type;
		this.itemId    = this.type === Constant.wallpaperType.Image ? this.settingItemId.favoriteImageSet : this.settingItemId.favoriteSlideSet;
		this.prompt    = "Enter the name of the favorite setting to be registered.";
		this.validate  = BaseValidator.validateRequired;
	}

	public async after(): Promise<void> {
		const [favorite, registered] = this.createRegistFavorite();
		const message                = `Registered ${this.inputResult} to my favorites!`;

		if (Object.keys(registered).includes(this.inputResult)) {
			this.state.placeholder = "There is a favorite setting with the same name, do you want to overwrite it?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title + " - Confirm", guideGroupId: this.guideGroupId },
				args:  [{ yes: "Overwrite.", no: "Back to previous." }, registFavorite, this.itemId, this.state, message, { favorite: favorite, option: registered }]
			}]);
		} else {
			registFavorite(this.itemId, this.state, message, { favorite: favorite, option: registered });
		}
	}

	private createRegistFavorite(): Partial<Favorite>[] {
		let favorite:   Partial<Favorite> = {};
		let registered: Partial<Favorite> = {};

		if (this.type === Constant.wallpaperType.Image) {
			favorite[this.inputResult] = {
				filePath: this.settings.filePath.value,
				opacity:  this.settings.opacity.validValue
			};
			registered                 = this.settings.favoriteImageSet.value;
		} else {
			favorite[this.inputResult] = {
				slideFilePaths:    this.settings.slideFilePaths.value,
				opacity:           this.settings.opacity.validValue,
				slideInterval:     this.settings.slideInterval.validValue,
				slideIntervalUnit: this.settings.slideIntervalUnit.value,
				slideRandomPlay:   this.settings.slideRandomPlay.validValue,
				slideEffectFadeIn: this.settings.slideEffectFadeIn.validValue
			}
			registered                 = this.settings.favoriteSlideSet.value;
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
			this.items = this.favorites2Items(this.settings.favoriteImageSet.value);
		} else {
			this.items = this.favorites2Items(this.settings.favoriteSlideSet.value);
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

	private favorites2Items(favorites: Favorite): QuickPickItem[] {
		return Object.keys(favorites).map((label) => ({ label: BaseRegistedFavoriteOperationGuide.labelling + label }))
	}
}

export class UnRegisterFavoriteGuide extends BaseRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  number
	) {
		super(state, type, { returnItem: "Return without unregister." });

		this.placeholder = "Select the favorite settings to unregister.";
	}

	public async after(): Promise<void> {
		await super.after();

		if (this.activeItem !== this.returnItem) {
			const name     = this.activeItemLabel;
			const message  = `UnRegistered ${name} from my favorites!`;

			let   favorite = this.removedFavorite(this.type, name);

			this.state.placeholder = "Do you want to unregister it?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title + " - Confirm", guideGroupId: this.guideGroupId },
				args:  [
					{ yes: "UnRegister.", no: "Back to previous." },
					(Object.keys(favorite).length > 0 ? registFavorite : removeFavorite),
					this.itemId,
					this.state,
					message,
					(Object.keys(favorite).length > 0 ? { favorite: favorite } : undefined)
				]
			}]);
		}
	}

	private removedFavorite(type: number, removeFavoriteName: string): Partial<Favorite> {
		let registered: Favorite = {};
		let favorite:   Favorite = {};

		if (this.type === Constant.wallpaperType.Image) {
			registered = this.settings.favoriteImageSet.value;
		} else {
			registered = this.settings.favoriteSlideSet.value;
		}

		Object.keys(registered).map(
			(key) => {
				if (removeFavoriteName !== key) {
					favorite[key] = registered[key];
				}
			}
		);

		return favorite;
	}
}

export class LoadFavoriteGuide extends BaseRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  number
	) {
		super(state, type, { returnItem: "Return without loading any changes." });

		this.placeholder = "Select the favorite settings to load.";
	}

	public async after(): Promise<void> {
		await super.after();

		if (this.activeItem !== this.returnItem) {
			await this.loadFavorite(this.activeItemLabel);
		}
	}

	private async loadFavorite(favoriteName: string) {
		let favorite: Partial<Favorite> = {};

		if (this.type === Constant.wallpaperType.Image) {
			favorite = this.settings.favoriteImageSet.value[favoriteName] as Partial<Favorite>;
		} else {
			favorite = this.settings.favoriteSlideSet.value[favoriteName] as Partial<Favorite>;
		}

		for (let key of Object.keys(favorite)) {
			await this.settings.setItemValue(key, favorite[key]);
		}

		if (this.type === Constant.wallpaperType.Image) {
			this.installer.install();
		} else {
			this.installer.installAsSlide();
		}

		this.state.reload = true;
	}
}

export class FavoriteRandomSetGuide extends BaseQuickPickGuide {
	constructor(
		state: State,
	) {
		super(state);

		this.itemId      = this.settingItemId.slideEffectFadeIn;
		this.placeholder = "Do you want to set a random wallpaper from your favorite settings at start up?";
		this.items       = Constant.favoriteRandomSet;
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.items[2]) {
			this.prev();
		} else {
			if (this.activeItem) {
				await this.settings.setItemValue(this.settingItemId.favoriteRandomSet, this.activeItem.label);

				if (this.activeItem === this.items[0]) {
					this.state.reload = true;
				}	
			}
		}
	}
}
