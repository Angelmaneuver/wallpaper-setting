import { QuickPickItem }             from "vscode";
import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { State }                     from "./base/base";
import { BaseInputGuide }            from "./base/input";
import { BaseQuickPickGuide }        from "./base/pick";
import { Favorite }                  from "../settings/extension";
import { BaseValidator }             from "./validator/base";
import { GuideFactory }              from "./factory/base";
import { VSCodePreset }              from "../utils/base/vscodePreset";
import { ImageFilePathGuide }        from "./image";
import { OpacityGuide }              from "./opacity";
import {
	SlideFilePathsGuide,
	SlideIntervalGuide,
	SlideIntervalUnitGuide,
	SlideRandomPlayGuide,
	SlideEffectFadeInGuide
} from "./slide";

export const Type = { Image: 0, Slide: 1 };

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

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.nextStep                             = undefined;

		await super.show(input);

		let favorite: Partial<Favorite>           = {};
		let registeredFavorite: Partial<Favorite> = {};

		if (this.type === Type.Image) {
			favorite[this.inputResult] = {
				filePath: this.settings.filePath,
				opacity:  this.settings.opacity
			}
			registeredFavorite         = this.settings.favoriteImageSet;
		} else {
			favorite[this.inputResult] = {
				slideFilePaths:    this.settings.slideFilePaths,
				opacity:           this.settings.opacity,
				slideInterval:     this.settings.slideIntervalUnit2Millisecond,
				slideIntervalUnit: this.settings.slideIntervalUnit,
				slideRandomPlay:   this.settings.slideRandomPlay,
				slideEffectFadeIn: this.settings.slideEffectFadeIn
			}
			registeredFavorite         = this.settings.favoriteSlideSet;
		}

		if (Object.keys(registeredFavorite).includes(this.inputResult)) {
			this.state.title       = this.title + " - Confirm";
			this.state.placeholder = "There is a favorite setting with the same name, do you want to overwrite it?";
			this.setNextStep(
				GuideFactory.create(
					"BaseConfirmGuide",
					this.state,
					{
						yes: "Overwrite.",
						no:  "Back to previous.",
					},
					this.registerFavorite,
					this.itemId,
					this.inputResult,
					favorite,
					registeredFavorite
				)
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

		this.state.message = `Added ${name} to my favorites!`;
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
		this.returnItem   = VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return", "Return without loading any changes.");

		if (this.type === Type.Image) {
			this.items = Object.keys(this.settings.favoriteImageSet).map((label) => ({ label: LoadFavoriteGuide.labelling + label }));
		} else {
			this.items = Object.keys(this.settings.favoriteSlideSet).map((label) => ({ label: LoadFavoriteGuide.labelling + label }));
		}

		this.items        = this.items.concat([this.returnItem]);
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		await super.show(input);

		if (this.activeItem === this.returnItem) {
			this.prev();
		} else {
			if (this.activeItem) {
				const name = this.activeItem.label.replace(LoadFavoriteGuide.labelling, "");

				if (this.type === Type.Image) {
					let favorite = this.settings.favoriteImageSet[name];
	
					if (favorite["filePath"] && favorite["opacity"]) {
						await this.settings.set(ImageFilePathGuide.itemId, favorite.filePath);
						await this.settings.set(OpacityGuide.itemId,       favorite.opacity);
					}

					this.installer.install();
					this.state.reload = true;
				} else if (this.type === Type.Slide) {
					let favorite = this.settings.favoriteSlideSet[name];

					if (
						favorite["slideFilePaths"] &&
						favorite["opacity"] &&
						favorite["slideInterval"] &&
						favorite["slideIntervalUnit"]
					) {
						await this.settings.set(SlideFilePathsGuide.itemId,    favorite.slideFilePaths);
						await this.settings.set(OpacityGuide.itemId,           favorite.opacity);
						await this.settings.set(SlideIntervalGuide.itmeId,     favorite.slideInterval);
						await this.settings.set(SlideIntervalUnitGuide.itemId, favorite.slideIntervalUnit);
						await this.settings.set(SlideRandomPlayGuide.itemId,   favorite.slideRandomPlay   ? favorite.slideRandomPlay   : false);
						await this.settings.set(SlideEffectFadeInGuide.itemId, favorite.slideEffectFadeIn ? favorite.slideEffectFadeIn : false);

						this.installer.installAsSlide();
						this.state.reload = true;
					}
				}
			}
		}
	}
}
