import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import * as Constant                    from "../../constant";
import { formatByArray }                from "../../utils/base/string";

export class SelectFavoriteProcess extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.placeholder = "Select the process you want to perform.";
		this.items       =
			[Constant.favoriteProcess[0]]
			.concat(this.settings.isFavoriteRegisterd ? [Constant.favoriteProcess[1], Constant.favoriteProcess[2], Constant.favoriteProcess[3]] : [])
			.concat([Constant.favoriteProcess[4]]);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case Constant.favoriteProcess[0].label:
				return this.setTransition(operation.Register);
			case Constant.favoriteProcess[1].label:
				return this.setTransition(operation.UnRegister);
			case Constant.favoriteProcess[2].label:
				return this.setTransition(operation.Load);
			case Constant.favoriteProcess[3].label:
				return this.startUp();
			default:
				return async () => { this.prev(); };
		}
	}

	private setTransition(key: string): () => Promise<void> {
		if (this.settings.FavoriteAutoset === undefined) {
			return async() => {
				this.setNextSteps([{
					key:   `SelectFavoriteOperationType`,
					state: this.createBaseState(` - ${key}`, `${this.guideGroupId}${key}`),
					args:  [key]
				}]);
			};
		} else {
			const typeName = Object.keys(Constant.wallpaperType).filter(
				(key) => {
					return Constant.wallpaperType[key] === this.settings.FavoriteAutoset;
				}
			)[0];

			return async () => {
				this.setNextSteps([{
					key:   `${key}FavoriteGuide`,
					state: this.createBaseState(`${this.title} - ${key} - ${typeName} wallpaper`, `${this.guideGroupId}${key}${typeName}`),
					args:  [this.settings.FavoriteAutoset]
				}]);
			};
		}
	}

	private startUp(): () => Promise<void> {
		this.state.activeItem = this.getItemByLabel(Constant.favoriteRandomSet, this.settings.favoriteRandomSet.valueAsString);

		return async () => {
			this.setNextSteps([{
				key:   "FavoriteRandomSetGuide",
				state: { title: this.title + " - Start up", guideGroupId: this.guideGroupId + "Startup" }
			}]);
		};
	}
}

const operation = { Register: "Register", UnRegister: "UnRegister", Load: "Load" };

export class SelectFavoriteOperationType extends AbstractQuickPickSelectGuide {
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

		if (this.operationType === operation.Register || this.operationType === operation.UnRegister) {
			this.placeholder = formatByArray(
				"Select the type of wallpaper you want to {0} for favorite.",
				this.operationType === operation.Register ? "register" : "unregister"
			);
			this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
				item1:  formatByArray("{0} to favorite the current wallpaper image settings.", this.operationType),
				item2:  formatByArray("{0} to favorite the current wallpaper slide settings.", this.operationType),
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
		if (label === undefined || label === this.items[2].label) {
			return async () => { this.prev(); };
		}

		const [wallpaperType, typeName, itemId] = this.getParameter(label);

		this.state.itemId = itemId;

		return async () => {
			this.setNextSteps([{
				key:   `${this.operationType}FavoriteGuide`,
				state: this.createBaseState(` - ${typeName} wallpaper`, `${this.guideGroupId}${typeName}`),
				args:  [wallpaperType]
			}]);
		};
	}

	private getParameter(label: string): [number, string, string] {
		if (label === this.items[0].label) {
			return [Constant.wallpaperType.Image, "Image", "favoriteWallpaperImageSet"];
		} else {
			return [Constant.wallpaperType.Slide, "Slide", "favoriteWallpaperSlideSet"];
		}
	}
}
