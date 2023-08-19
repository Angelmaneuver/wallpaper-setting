import {
	window,
	commands,
	QuickPickItem,
}                                from "vscode";
import { State }                 from "./base/base";
import { BaseInputGuide }        from "./base/input";
import {
	AbstractQuickPickGuide,
	AbstractQuickPickSelectGuide
}                                from "./base/pick";
import { BaseValidator }         from "./validator/base";
import { Favorite }              from "../settings/extension";
import * as StartUp              from "../favorite";
import { ExtensionSetting }      from "../settings/extension";
import { VSCodePreset }          from "../utils/base/vscodePreset";
import {
	messages,
	words,
	types,
	WallpaperType,
	quickpicks,
}                                from "../constant";

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
	private type: WallpaperType;

	constructor(state: State, type: WallpaperType) {
		super(state);

		this.type = type;
	}

	public init(): void {
		super.init();

		this.itemId   = types.wallpaper.image === this.type ? this.itemIds.favoriteImageSet : this.itemIds.favoriteSlideSet;
		this.prompt   = messages.placeholder.favorite.register.message;
		this.validate = BaseValidator.validateRequired;
	}

	public async after(): Promise<void> {
		const [favorite, registered] = this.createRegistFavorite();
		const message                = messages.showInformationMessage.favorite.register(this.inputValueAsString);

		if (Object.keys(registered).includes(this.inputValueAsString)) {
			this.state.placeholder = messages.placeholder.favorite.register.override.confirm.message;
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title + words.headline.confirm, guideGroupId: this.guideGroupId },
				args:  [
					{
						yes: messages.placeholder.favorite.register.override.confirm.yes,
						no:  messages.placeholder.favorite.register.override.confirm.no,
					},
					registFavorite, this.itemId, this.state, message, { favorite: favorite, option: registered }]
			}]);
		} else {
			return registFavorite(this.itemId, this.state, message, { favorite: favorite, option: registered });
		}
	}

	private createRegistFavorite(): Array<Partial<Favorite>> {
		const favorite:   Partial<Favorite> = {};
		let   registered: Partial<Favorite> = {};

		if (types.wallpaper.image === this.type) {
			favorite[this.inputValueAsString] = {
				filePath: this.settings.filePath.value,
			};
			registered = this.settings.favoriteImageSet.value;
		} else {
			favorite[this.inputValueAsString] = {
				slideFilePaths:        this.settings.slideFilePaths.value,
				slideInterval:         this.settings.slideInterval.validValue,
				slideIntervalUnit:     this.settings.slideIntervalUnit.value,
				slideRandomPlay:       this.settings.slideRandomPlay.validValue,
				slideEffectFadeIn:     this.settings.slideEffectFadeIn.validValue,
				slideLoadWaitComplete: this.settings.slideLoadWaitComplete.validValue,
			}
			registered = this.settings.favoriteSlideSet.value;
		}

		if (!this.settings.isAdvancedMode) {
			(favorite[this.inputValueAsString] as Record<string, unknown>)["opacity"] = this.settings.opacity.validValue;
		}

		return [favorite, registered];
	}
}

abstract class AbstractRegistedFavoriteOperationGuide extends AbstractQuickPickGuide {
	protected static labelling = "$(file-media) ";
	protected type:       number;
	protected returnItem: QuickPickItem;

	constructor(state: State, type: WallpaperType, description: { returnItem: string }) {
		super(state);

		this.type       = type;
		this.returnItem = VSCodePreset.create(VSCodePreset.Icons.reply, words.return, description.returnItem);
	}

	public init(): void {
		super.init();

		if (types.wallpaper.image === this.type) {
			this.itemId = this.itemIds.favoriteImageSet;
			this.items  = this.favorites2Items(this.settings.favoriteImageSet.value);
		} else {
			this.itemId = this.itemIds.favoriteSlideSet;
			this.items  = this.favorites2Items(this.settings.favoriteSlideSet.value)
		}

		this.items  = this.items.concat([this.returnItem]);
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

export class OpenFavoriteGuide extends AbstractRegistedFavoriteOperationGuide {
	constructor(
		state: State,
		type:  WallpaperType
	) {
		super(state, type, { returnItem: messages.backToPrevious });
	}

	public init(): void {
		super.init();

		this.placeholder = messages.placeholder.favorite.open;
	}

	public async after(): Promise<void> {
		if (this.activeItem === this.returnItem) {
			await super.after();
		} else {
			this.setupNextStep();
		}
	}

	private setupNextStep(): void {
		this.setNextSteps([{
			key:   "SelectExecuteOperationFavoriteGuide",
			state: { title: `${this.title} - ${this.activeItemLabel}`, itemId: this.itemId, guideGroupId: this.guideGroupId },
			args:  [this.type, this.activeItemLabel],
		}]);
	}
}

export class SelectExecuteOperationFavoriteGuide extends AbstractQuickPickSelectGuide {
	protected type: WallpaperType;
	protected name: string;

	constructor(
		state: State,
		type:  WallpaperType,
		name:  string
	) {
		super(state);

		this.type = type;
		this.name = name;
	}

	public init(): void {
		super.init();

		this.placeholder = messages.placeholder.favorite.selectExecute;
		this.items       = [
			VSCodePreset.create(VSCodePreset.Icons.debugStart,  ...quickpicks.favorite.set),
			VSCodePreset.create(VSCodePreset.Icons.emptyWindow, ...quickpicks.favorite.windowOpen),
			VSCodePreset.create(VSCodePreset.Icons.trashcan,    ...quickpicks.favorite.delete),
		];
	}

	public getExecute(label: string): () => Promise<void> {
		switch (label) {
			case this.items[0].label:
				return async () => { await this.set(); };
			case this.items[1].label:
				return async () => { await this.newWindow(); };
			case this.items[2].label:
				return async () => { this.delete(); }
			default:
				return async () => { this.prev(); }
		}
	}

	private async set(): Promise<void> {
		await this.loadFavorite();

		this.state.reload = true;
	}

	private async newWindow(): Promise<void> {
		const backup = new ExtensionSetting();

		this.installer.holdScriptData();

		await this.loadFavorite();

		commands.executeCommand('workbench.action.newWindow');
			
		window.showInformationMessage(
			messages.showInformationMessage.favorite.selectExecute.newWindow,
			messages.showInformationMessage.favorite.selectExecute.ok,
		).then(() => {
			this.installer.installWithPrevious();
			backup.batchInstall();
		});
	}

	private delete(): void {
		const message  = messages.showInformationMessage.favorite.delete(this.name);
		const favorite = this.removedFavorite();

		this.state.placeholder = messages.placeholder.favorite.delete.confirm.message;
		this.setNextSteps([{
			key:   "BaseConfirmGuide",
			state: { title: this.title + words.headline.confirm, guideGroupId: this.guideGroupId },
			args:  [
				{
					yes: messages.placeholder.favorite.delete.confirm.yes,
					no:  messages.placeholder.favorite.delete.confirm.no,
				},
				(Object.keys(favorite).length > 0 ? registFavorite : removeFavorite),
				this.itemId,
				this.state,
				message,
				(Object.keys(favorite).length > 0 ? { favorite: favorite } : undefined)
			]
		}]);
	}

	private async loadFavorite(): Promise<void> {
		let favorite: Partial<Favorite> = {};

		if (types.wallpaper.image === this.type) {
			favorite = this.settings.favoriteImageSet.value[this.name] as Partial<Favorite>;
		} else {
			favorite = this.settings.favoriteSlideSet.value[this.name] as Partial<Favorite>;
		}

		for (const key of Object.keys(favorite)) {
			await this.settings.setItemValue(this.itemIds[key], favorite[key]);
		}

		if (types.wallpaper.image === this.type) {
			this.installer.install();
		} else {
			this.installer.installAsSlide();
		}
	}

	private removedFavorite(): Partial<Favorite> {
		let   registered: Favorite = {};
		const favorite:   Favorite = {};

		if (types.wallpaper.image === this.type) {
			registered = this.settings.favoriteImageSet.value;
		} else {
			registered = this.settings.favoriteSlideSet.value;
		}

		Object.keys(registered).map(
			(key) => {
				if (this.name !== key) { favorite[key] = registered[key]; }
			}
		);

		return favorite;
	}
}

export class FavoriteRandomSetGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.itemId      = this.itemIds.favoriteRandomSet;
		this.placeholder = messages.placeholder.favorite.randomSet.message;
		this.items       = quickpicks.favorite.randomSet;
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
				return async () => { await this.settings.setItemValue(this.itemIds.favoriteRandomSetFilter, this.settings.favoriteRandomSetFilter.defaultValue); await this.registSetting(); await StartUp.randomSet(); };
			default:
				return async () => { this.prev(); }
		}
	}
}

export class FavoriteRandomSetFilterGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.itemId      = this.itemIds.favoriteRandomSetFilter;
		this.placeholder = messages.placeholder.favorite.randomSet.filter;
		this.items       = quickpicks.favorite.randomSetFilter;
		this.activeItem  = this.getItemByLabelString(this.items, this.settings.favoriteRandomSetFilter.validValue);
	}

	public getExecute(label: string): () => Promise<void> {
		if (this.items[3].label === label) {
			return async () => { this.prev(); }
		} else {
			return async () => { this.state.reload = true; this.setInputValueLabelString4GuideGroupResultSet(); await this.registSetting(); await StartUp.randomSet(); };
		}
	}
}
