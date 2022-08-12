import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import * as Constant                    from "../../constant";

export class SelectFavoriteProcess extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.placeholder = "Select the process you want to perform.";
		this.items       =
			[Constant.favoriteProcess[0]]
			.concat(this.settings.isFavoriteRegisterd ? [Constant.favoriteProcess[1], Constant.favoriteProcess[2]] : [])
			.concat([Constant.favoriteProcess[3]]);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case Constant.favoriteProcess[0].label:
				return this.setTransition(operation.Register);
			case Constant.favoriteProcess[1].label:
				return this.setTransition(operation.Open);
			case Constant.favoriteProcess[2].label:
				return this.startUp();
			default:
				return async () => { this.prev(); };
		}
	}

	private setTransition(key: string): () => Promise<void> {
		const autoSet                      = key === operation.Register ? this.installer.isAutoSet : this.settings.FavoriteAutoset;
		let   className                    = '';
		let   title                        = '';
		let   guideGroupId                 = '';
		const args: Array<string | number> = [];

		if (autoSet === undefined) {
			className    = `SelectFavoriteOperationType`;
			title        = key === operation.Register ? ` - ${key}` : ``;
			guideGroupId = `${this.guideGroupId}${key}`;

			args.push(key);
		} else {
			const typeName = Object.keys(Constant.wallpaperType).filter(
				(key) => {
					return Constant.wallpaperType[key] === autoSet;
				}
			)[0];

			className    = `${key}FavoriteGuide`;
			title        = key === operation.Register ? ` - ${key} - ${typeName} wallpaper` : ``;
			guideGroupId = `${this.guideGroupId}${key}${typeName}`;

			args.push(autoSet);
		}

		return async() => {
			this.setNextSteps([{
				key:   className,
				state: this.createBaseState(title, guideGroupId),
				args:  args,
			}]);
		};
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

const operation = { Register: "Register", Open: "Open" };

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

		if (this.operationType === operation.Register) {
			this.placeholder = "Select the type of wallpaper you want to register for favorite.",
			this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
				item1:  "register favorite the current wallpaper image settings.",
				item2:  "register favorite the current wallpaper slide settings.",
				return: "Back to previous."
			});
		} else {
			this.placeholder = "Select the type of wallpaper you want to Open.";
			this.items       = Constant.itemsCreat(Constant.ItemType.Wallpaper, {
				item1:  "Open wallpaper image settings from favorites.",
				item2:  "Open wallpaper slide settings from favorites.",
				return: "Back to previous."
			});
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		if (label === undefined || label === this.items[2].label) {
			return async () => { this.prev(); };
		}

		const [wallpaperType, typeName] = this.getParameter(label);

		return async () => {
			this.setNextSteps([{
				key:   `${this.operationType}FavoriteGuide`,
				state: this.createBaseState(` - ${typeName} wallpaper`, `${this.guideGroupId}${typeName}`),
				args:  [wallpaperType]
			}]);
		};
	}

	private getParameter(label: string): [number, string] {
		if (label === this.items[0].label) {
			return [Constant.wallpaperType.Image, "Image"];
		} else {
			return [Constant.wallpaperType.Slide, "Slide"];
		}
	}
}
