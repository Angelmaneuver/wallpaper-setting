import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseQuickPickGuide }        from "../base/pick";
import { State }                     from "../base/base";
import { QuickPickItem }             from "vscode";
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
				this.setTransition(operation.Register);
				break;
			case Constant.favoriteProcess[1]:
				this.setTransition(operation.UnRegister);
				break;
			case Constant.favoriteProcess[2]:
				this.setTransition(operation.Load);
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
		if (this.settings.FavoriteAutoset === undefined) {
			this.setNextSteps([{
				key:   `SelectFavoriteOperationType`,
				state: { title: `${this.title} - ${key}`, guideGroupId: `${this.guideGroupId}${key}` },
				args:  [key]
			}]);
		} else {
			let typeName = Object.keys(Constant.wallpaperType).filter(
				(key) => {
					return Constant.wallpaperType[key] === this.settings.FavoriteAutoset;
				}
			)[0];

			this.setNextSteps([{
				key:   `${key}FavoriteGuide`,
				state: { title: `${this.title} - ${key} - ${typeName} wallpaper`, guideGroupId: `${this.guideGroupId}${key}${typeName}` },
				args:  [this.settings.FavoriteAutoset]
			}]);
		}
	}
}

const operation = { Register: "Register", UnRegister: "UnRegister", Load: "Load" };

export class SelectFavoriteOperationType extends BaseQuickPickGuide {
	private operationType: string;

	constructor(
		state:     State,
		operationType: string
	) {
		if (operationType === operation.Register) {
			state.placeholder = "Select the type of wallpaper you want to register for favorite.";
			state.items       = SelectFavoriteOperationType.createItems({
				image:  "Register to favorite the current wallpaper image settings.",
				slide:  "Register to favorite the current wallpaper slide settings.",
				return: "Return without saving any changes."
			});
		} else if (operationType === operation.UnRegister) {
			state.placeholder = "Select the type of wallpaper you want to unregister for favorite.";
			state.items       = SelectFavoriteOperationType.createItems({
				image:  "UnRegister the wallpaper image setting from favorite.",
				slide:  "UnRegister the wallpaper slide setting from favorite.",
				return: "Return without saving any changes."
			});
		} else {
			state.placeholder = "Select the type of wallpaper you want to load.";
			state.items       = SelectFavoriteOperationType.createItems({
				image:  "Load wallpaper image settings from favorites.",
				slide:  "Load wallpaper slide settings from favorites.",
				return: "Return without loading any changes."
			});
		}

		super(state);

		this.operationType = operationType;
	}

	public async after(): Promise<void> {
		if (this.activeItem) {
			switch (this.activeItem) {
				case this.items[0]:
					this.state.itemId = "favoriteWallpaperImageSet";
					this.setNextSteps([{
						key:   `${this.operationType}FavoriteGuide`,
						state: { title: this.title + " - Image wallpaper", guideGroupId: this.guideGroupId + "Image" },
						args:  [Constant.wallpaperType.Image]
					}]);
					break;
				case this.items[1]:
					this.state.itemId = "favoriteWallpaperSlideSet";
					this.setNextSteps([{
						key:   `${this.operationType}FavoriteGuide`,
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

	private static createItems(description: { image: string, slide: string, return: string }): QuickPickItem[] {
		return [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image",  description.image),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide",  description.slide),
			VSCodePreset.create(VSCodePreset.Icons.reply,     "Return", description.return)
		];
	}
}
