import { QuickPickItem }         from "vscode";
import { State }                 from "./base/base";
import { BaseInputGuide }        from "./base/input";
import {
	AbstractQuickPickGuide,
	AbstractQuickPickSelectGuide
}                                from "./base/pick";
import { BaseValidator }         from "./validator/base";
import { Favorite }              from "../settings/extension";
import * as StartUp              from "../favorite";
import { VSCodePreset }          from "../utils/base/vscodePreset";
import * as Constant             from "../constant";

async function registFavorite(
	key:       string,
	state:     State,
	message:   string,
	favorites: { favorite: Partial<Favorite>, option?:  Partial<Favorite> }
): Promise<void> {
	let registFavorite: Partial<Favorite> = {};

	if (favorites.option && Object.keys(favorites.option).length > 0) {
		const temporary = { ...favorites.option, ...favorites.favorite};

		Object.keys(temporary).sort().map((key) => { registFavorite[key] = temporary[key]; });
	} else {
		registFavorite  = favorites.favorite;
	}

	state.message = message;

	return state.settings.setItemValue(key, registFavorite);
}

async function removeFavorite(key: string, state: State, message: string): Promise<void> {
	state.message = message;

	return state.settings.setItemValue(key, undefined);
}

export class RegisterFavoriteGuide extends BaseInputGuide {
	private type: number;

	constructor(state: State, type: number) {
		super(state);

		this.type = type;
	}

	public init(): void {
		super.init();

		this.itemId   = this.type === Constant.wallpaperType.Image ? this.itemIds.favoriteImageSet : this.itemIds.favoriteSlideSet;
		this.prompt   = "Enter the name of the favorite setting to be registered.";
		this.validate = BaseValidator.validateRequired;
	}

	public async after(): Promise<void> {
		const [favorite, registered] = this.createRegistFavorite();
		const message                = `Registered ${this.inputValueAsString} to my favorites!`;

		if (Object.keys(registered).includes(this.inputValueAsString)) {
			this.state.placeholder = "There is a favorite setting with the same name, do you want to overwrite it?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title + " - Confirm", guideGroupId: this.guideGroupId },
				args:  [{ yes: "Overwrite.", no: "Back to previous." }, registFavorite, this.itemId, this.state, message, { favorite: favorite, option: registered }]
			}]);
		} else {
			return registFavorite(this.itemId, this.state, message, { favorite: favorite, option: registered });
		}
	}

	private createRegistFavorite(): Array<Partial<Favorite>> {
		const favorite:   Partial<Favorite> = {};
		let   registered: Partial<Favorite> = {};

		if (this.type === Constant.wallpaperType.Image) {
			favorite[this.inputValueAsString] = {
				filePath: this.settings.filePath.value,
				opacity:  this.settings.opacity.validValue
			};
			registered = this.settings.favoriteImageSet.value;
		} else {
			favorite[this.inputValueAsString] = {
				slideFilePaths:    this.settings.slideFilePaths.value,
				opacity:           this.settings.opacity.validValue,
				slideInterval:     this.settings.slideInterval.validValue,
				slideIntervalUnit: this.settings.slideIntervalUnit.value,
				slideRandomPlay:   this.settings.slideRandomPlay.validValue,
				slideEffectFadeIn: this.settings.slideEffectFadeIn.validValue
			}
			registered = this.settings.favoriteSlideSet.value;
		}

		return [favorite, registered];
	}
}

abstract class AbstractRegistedFavoriteOperationGuide extends AbstractQuickPickGuide {
	protected static labelling = "$(file-media) ";
	protected type:       number;
	protected returnItem: QuickPickItem;

	constructor(state: State, type: number, description: { returnItem: string }) {
		super(state);

		this.type       = type;
		this.returnItem = VSCodePreset.create(VSCodePreset.Icons.reply, "Return", description.returnItem);
	}

	public init(): void {
		super.init();

		if (this.type === Constant.wallpaperType.Image) {
			this.itemId = this.itemIds.favoriteImageSet;
			this.items  = this.favorites2Items(this.settings.favoriteImageSet.value);
		} else {
			this.itemId = this.itemIds.favoriteSlideSet;
			this.items  = this.favorites2Items(this.settings.favoriteSlideSet.value);
		}

		this.items = this.items.concat([this.returnItem]);
	}

	public async after(): Promise<void> {
		this.prev();
	}

	protected get activeItemLabel(): string {
		return this.activeItem ? this.activeItem.label.replace(AbstractRegistedFavoriteOperationGuide.labelling, "") : "";
	}

	private favorites2Items(favorites: Favorite): QuickPickItem[] {
		return Object.keys(favorites).map((label) => ({ label: AbstractRegistedFavoriteOperationGuide.labelling + label }))
	}
}

export class UnRegisterFavoriteGuide extends AbstractRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  number
	) {
		super(state, type, { returnItem: "Return without unregister." });
	}

	public init(): void {
		super.init();

		this.placeholder = "Select the favorite settings to unregister.";
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.returnItem) {
			await super.after();
		} else {
			this.setupNextStep();
		}
	}

	private setupNextStep(): void {
		const name     = this.activeItemLabel;
		const message  = `UnRegistered ${name} from my favorites!`;

		const favorite = this.removedFavorite(this.type, name);

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

	private removedFavorite(type: number, removeFavoriteName: string): Partial<Favorite> {
		let   registered: Favorite = {};
		const favorite:   Favorite = {};

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

export class LoadFavoriteGuide extends AbstractRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  number
	) {
		super(state, type, { returnItem: "Return without loading any changes." });
	}

	public init(): void {
		super.init();

		this.placeholder = "Select the favorite settings to load.";
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.returnItem) {
			await super.after();
		} else {
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

		for (const key of Object.keys(favorite)) {
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

export class FavoriteRandomSetGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.itemId      = this.itemIds.favoriteRandomSet;
		this.placeholder = "Do you want to set a random wallpaper from your favorite settings at start up?";
		this.items       = Constant.favoriteRandomSet;
	}

	public getExecute(label: string): () => Promise<void> {
		switch (label) {
			case this.items[0].label:
				if (this.settings.isFavoriteRegisterd && undefined === this.settings.FavoriteAutoset) {
					return async () => {
						this.setNextSteps([{
							key:   "FavoriteRandomSetFilterGuide",
							state: { title: this.title, guideGroupId: this.guideGroupId }
						}]);
					};
				} else {
					this.state.reload = true;
				}
				// fallsthrough
			case this.items[1].label:
				return async () => {
					await this.settings.setItemValue(
						this.itemIds.favoriteRandomSetFilter,
						this.settings.favoriteRandomSetFilter.defaultValue
					);
					await this.registSetting();
					await StartUp.randomSet();
				};
			default:
				return async () => { this.prev(); }
		}
	}
}

export class FavoriteRandomSetFilterGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.itemId      = this.itemIds.favoriteRandomSetFilter;
		this.placeholder = "Select the favorite type you want to set as random.";
		this.items       = Constant.favoriteRandomSetFilter;
		this.activeItem  = this.getItemByLabelString(this.items, this.settings.favoriteRandomSetFilter.validValue);
	}

	public getExecute(label: string): () => Promise<void> {
		switch (label) {
			case this.items[0].label: // fallshrough
			case this.items[1].label: // fallshrough
			case this.items[2].label: // fallshrough
				return async () => {
					this.state.reload = true;
					this.setInputValueLabelString4GuideGroupResultSet();
					await this.registSetting();
					await StartUp.randomSet();
				};
			default:
				return async () => { this.prev(); }
		}
	}
}
