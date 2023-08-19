import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import { VSCodePreset }                 from "../../utils/base/vscodePreset";
import {
	messages,
	words,
	quickpicks,
	types,
}                                       from "../../constant";

const items = [
	VSCodePreset.create(VSCodePreset.Icons.repoPush, ...quickpicks.favorite.select.process.regisiter),
	VSCodePreset.create(VSCodePreset.Icons.repoPull, ...quickpicks.favorite.select.process.open),
	VSCodePreset.create(VSCodePreset.Icons.merge,    ...quickpicks.favorite.select.process.startUp),
	quickpicks.backToPrevious,
];

type  OperationType = { key: string, name: string };
const Operation     = {
	Register: { key: "Register", name: words.register },
	Open:     { key: "Open",     name: words.open },
} as const;

export class SelectFavoriteProcess extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.placeholder = messages.placeholder.favorite.select.process;
		this.items       = [items[0]].concat(
			this.settings.isFavoriteRegisterd ? [items[1], items[2]] : []
		).concat(
			items[3]
		);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items[0].label:
				return this.setTransition(Operation.Register);
			case items[1].label:
				return this.setTransition(Operation.Open);
			case items[2].label:
				return this.startUp();
			default:
				return async () => { this.prev(); };
		}
	}

	private setTransition(operation: OperationType): () => Promise<void> {
		const key                          = operation.key;
		const autoSet                      = Operation.Register.key === key ? this.installer.isAutoSet        : this.settings.FavoriteAutoset;
		let   title                        = Operation.Register.key === key ? ` - ${Operation.Register.name}` : "";
		let   className                    = "";
		let   guideGroupId                 = "";
		const args: Array<string | number> = [];

		if (autoSet === undefined) {
			className    = `SelectFavoriteOperationType`;
			guideGroupId = `${this.guideGroupId}${operation.key}`;

			args.push(operation.key);
		} else {
			const [typeKey, typeName] = ((type: number) => {
				if (types.wallpaper.image === type) {
					return ["Image", words.wallpaper.image];
				} else {
					return ["Slide", words.wallpaper.slide];
				}
			})(autoSet);

			className    =  `${key}FavoriteGuide`;
			title        += Operation.Register.key === key ? ` - ${typeName}` : "";
			guideGroupId =  `${this.guideGroupId}${key}${typeKey}`;

			args.push(autoSet);
		}

		return async() => {
			this.setNextSteps([{ key: className, state: this.createBaseState(title, guideGroupId), args: args }]);
		};
	}

	private startUp(): () => Promise<void> {
		this.state.activeItem = this.getItemByLabel(quickpicks.favorite.randomSet, this.settings.favoriteRandomSet.valueAsString);

		return async () => {
			this.setNextSteps([{
				key:   "FavoriteRandomSetGuide",
				state: { title: this.title + words.headline.startUp, guideGroupId: this.guideGroupId + "Startup" }
			}]);
		};
	}
}

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

		if (Operation.Register.key === this.operationType) {
			this.placeholder = messages.placeholder.favorite.select.operation.register;
			this.items       = quickpicks.favorite.select.operation.register;
		} else {
			this.placeholder = messages.placeholder.favorite.select.operation.open;
			this.items       = quickpicks.favorite.select.operation.open;
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		if (label === undefined || label === this.items[2].label) {
			return async () => { this.prev(); };
		}

		const [wallpaperType, typeKey, typeName] = ((label: string) => {
			if (this.items[0].label === label) {
				return [types.wallpaper.image, "Image", words.wallpaper.image];
			} else {
				return [types.wallpaper.slide, "Slide", words.wallpaper.slide];
			}
		})(label);

		return async () => {
			this.setNextSteps([{
				key:   `${this.operationType}FavoriteGuide`,
				state: this.createBaseState(` - ${typeName}`, `${this.guideGroupId}${typeKey}`),
				args:  [wallpaperType]
			}]);
		};
	}
}
