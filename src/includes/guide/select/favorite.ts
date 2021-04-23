import { AbstractQuickPickGuide } from "../base/pick";
import { State }                  from "../base/base";
import * as Constant              from "../../constant";

export class SelectFavoriteProcess extends AbstractQuickPickGuide {
	public init(): void {
		super.init();

		this.placeholder = "Select the process you want to perform.";
		this.items       =
			[Constant.favoriteProcess[0]]
			.concat(this.settings.isRegisterd ? [Constant.favoriteProcess[1], Constant.favoriteProcess[2], Constant.favoriteProcess[3]] : [])
			.concat([Constant.favoriteProcess[4]]);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case Constant.favoriteProcess[0].label:
				return this.setTransition(operation.Register);
			case Constant.favoriteProcess[1].label:
				return this.setTransition(operation.UnRegister)
			case Constant.favoriteProcess[2].label:
				return this.setTransition(operation.Load);
			case Constant.favoriteProcess[3].label:
				return this.startUp();
			default:
				return async () => { this.prev(); }
		}
	}

	private setTransition(key: string): () => Promise<void> {
		if (this.settings.FavoriteAutoset === undefined) {
			return async() => {
				this.setNextSteps([{
					key:   `SelectFavoriteOperationType`,
					state: { title: `${this.title} - ${key}`, guideGroupId: `${this.guideGroupId}${key}` },
					args:  [key]
				}]);
			};
		} else {
			let typeName = Object.keys(Constant.wallpaperType).filter(
				(key) => {
					return Constant.wallpaperType[key] === this.settings.FavoriteAutoset;
				}
			)[0];

			return async () => {
				this.setNextSteps([{
					key:   `${key}FavoriteGuide`,
					state: { title: `${this.title} - ${key} - ${typeName} wallpaper`, guideGroupId: `${this.guideGroupId}${key}${typeName}` },
					args:  [this.settings.FavoriteAutoset]
				}]);
			};
		}
	}

	private startUp(): () => Promise<void> {
		this.state.activeItem = this.getItemByLabel(Constant.favoriteRandomSet, this.settings.favoriteRandomSet.value);

		return async () => {
			this.setNextSteps([{
				key:   "FavoriteRandomSetGuide",
				state: { title: this.title + " - Start up", guideGroupId: this.guideGroupId + "Startup" }
			}]);
		};
	}
}

const operation = { Register: "Register", UnRegister: "UnRegister", Load: "Load" };

export class SelectFavoriteOperationType extends AbstractQuickPickGuide {
	private operationType: string;

	constructor(
		state:     State,
		operationType: string
	) {
		super(state);

		this.operationType = operationType;
	}

	public init(): void {
		super.init();

		if (this.operationType === operation.Register) {
			this.placeholder = "Select the type of wallpaper you want to register for favorite.";
			this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
				item1:  "Register to favorite the current wallpaper image settings.",
				item2:  "Register to favorite the current wallpaper slide settings.",
				return: "Return without saving any changes."
			});
		} else if (this.operationType === operation.UnRegister) {
			this.placeholder = "Select the type of wallpaper you want to unregister for favorite.";
			this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
				item1:  "UnRegister the wallpaper image setting from favorite.",
				item2:  "UnRegister the wallpaper slide setting from favorite.",
				return: "Return without saving any changes."
			});
		} else {
			this.placeholder = "Select the type of wallpaper you want to load.";
			this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
				item1:  "Load wallpaper image settings from favorites.",
				item2:  "Load wallpaper slide settings from favorites.",
				return: "Return without loading any changes."
			});
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		let wallpaperType: number;
		let typeName:      string;
		let itemId:        string;

		switch (label) {
			case this.items[0].label:
				wallpaperType = Constant.wallpaperType.Image;
				typeName      = "Image";
				itemId        = "favoriteWallpaperImageSet";
				break;
			case this.items[1].label:
				wallpaperType = Constant.wallpaperType.Slide;
				typeName      = "Slide";
				itemId        = "favoriteWallpaperSlideSet";
				break;
			default:
				return async () => { this.prev(); };
		}

		this.state.itemId = itemId;

		return async () => {
			this.setNextSteps([{
				key:   `${this.operationType}FavoriteGuide`,
				state: { title: `${this.title} - ${typeName} wallpaper`, guideGroupId: `${this.guideGroupId}${typeName}` },
				args:  [wallpaperType]
			}]);
		};
	}
}
