import { InputStep, MultiStepInput }    from "../../utils/multiStepInput";
import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import { QuickPickItem }                from "vscode";
import { VSCodePreset }                 from "../../utils/base/vscodePreset";
import * as Wallpaper                   from "../select/wallpaper";
import * as Slide                       from "../slide";
import { quickpicks, words }            from "../../constant";

type optionState = { subState?: Partial<State>, initialValue?: string };

export class SelectParameterType extends AbstractQuickPickSelectGuide {
	private static templateItems: Array<QuickPickItem>     = [
		VSCodePreset.create(VSCodePreset.Icons.fileMedia,     ...quickpicks.parameter.image),
		VSCodePreset.create(VSCodePreset.Icons.folder,        ...quickpicks.parameter.slide.filePaths),
		VSCodePreset.create(VSCodePreset.Icons.eye,           ...quickpicks.parameter.opacity),
		VSCodePreset.create(VSCodePreset.Icons.clock,         ...quickpicks.parameter.slide.interval.time),
		VSCodePreset.create(VSCodePreset.Icons.law,           ...quickpicks.parameter.slide.interval.unit),
		VSCodePreset.create(VSCodePreset.Icons.merge,         ...quickpicks.parameter.slide.random),
		VSCodePreset.create(VSCodePreset.Icons.foldDown,      ...quickpicks.parameter.slide.effectFadeIn),
		VSCodePreset.create(VSCodePreset.Icons.debugContinue, ...quickpicks.parameter.slide.loadWaitComplete),
		VSCodePreset.create(VSCodePreset.Icons.save,          ...quickpicks.parameter.save),
		VSCodePreset.create(VSCodePreset.Icons.reply,         ...quickpicks.parameter.return),
	];

	private guideParameters: { [key: number]: [string, string, string, optionState] } = {};

	public init(): void {
		super.init();

		this.placeholder     = "Select the item you want to set.";
		this.guideParameters = {
			0: [this.itemIds.filePath,              "ImageFilePathGuide",   words.headline.image,                  this.createOptionState(this.itemIds.filePath)],
			1: [this.itemIds.slideFilePaths,        "SlideFilePathsGuide",  words.headline.slide.filePaths,        this.createOptionState(this.itemIds.slideFilePaths)],
			2: [this.itemIds.opacity,               "OpacityGuide",         words.headline.opacity,                this.createOptionState(this.itemIds.opacity)],
			3: [this.itemIds.slideInterval,         "SlideIntervalGuide",   words.headline.slide.interval.time,    this.createOptionState(this.itemIds.slideInterval)],
			4: [this.itemIds.slideIntervalUnit,     "BaseQuickPickGuide",   words.headline.slide.interval.unit,    this.createOptionState(this.itemIds.slideIntervalUnit)],
			5: [this.itemIds.slideRandomPlay,       "SlideRandomPlayGuide", words.headline.slide.random,           this.createOptionState(this.itemIds.slideRandomPlay)],
			6: [this.itemIds.slideEffectFadeIn,     "BaseQuickPickGuide",   words.headline.slide.effectFadeIn,     this.createOptionState(this.itemIds.slideEffectFadeIn)],
			7: [this.itemIds.slideLoadWaitComplete, "BaseQuickPickGuide",   words.headline.slide.loadWaitComplete, this.createOptionState(this.itemIds.slideLoadWaitComplete)],
		}
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.items = [
			SelectParameterType.templateItems[0],
			SelectParameterType.templateItems[1]
		].concat(this.settings.isAdvancedMode ? [] : SelectParameterType.templateItems[2],
		).concat(
			SelectParameterType.templateItems[3],
			SelectParameterType.templateItems[4],
			SelectParameterType.templateItems[5],
			SelectParameterType.templateItems[6],
			SelectParameterType.templateItems[7],
		).concat(Object.keys(this.guideGroupResultSet).length > 0 ? SelectParameterType.templateItems[8] : []
		).concat(SelectParameterType.templateItems[9]);

		await super.show(input);
	}

	protected getExecute(): (() => Promise<void>) | undefined {
		if (this.activeItem === SelectParameterType.templateItems[8]) {
			return async () => { await this.save(); };
		} else if (this.activeItem === SelectParameterType.templateItems[9]) {
			return async () => { this.prev(); };
		} else if (this.activeItem) {
			return async () => {
				if (this.activeItem) {
					Reflect.apply(
						this.createNextStep,
						this,
						this.guideParameters[SelectParameterType.templateItems.indexOf(this.activeItem)]
					);
				}
			};
		}
	}

	private createOptionState(itemId: string): optionState {
		const result: optionState = {};

		switch(itemId) {
			case this.itemIds.slideFilePaths:
			case this.itemIds.slideInterval:
			case this.itemIds.slideIntervalUnit:
			case this.itemIds.slideRandomPlay:
			case this.itemIds.slideEffectFadeIn:
			case this.itemIds.slideLoadWaitComplete:
				result["subState"] = Slide.getDefaultState(itemId);
		}

		if (
			itemId === this.itemIds.slideRandomPlay       ||
			itemId === this.itemIds.slideEffectFadeIn     ||
			itemId === this.itemIds.slideLoadWaitComplete
		) {
			result["initialValue"] = this.settings.getItem(itemId).value;
		} else if (itemId !== this.itemIds.slideFilePaths) {
			result["initialValue"] = this.validValue2initialValue(this.settings.getItem(itemId).validValue);
		}

		return result;
	}

	private validValue2initialValue(value: unknown): string {
		let result = "";

		if (typeof(value) === "number") {
			result = value.toString();
		} else if (typeof(value) === "string") {
			result = value;
		}

		return result;
	}

	private createNextStep(
		itemId:          string,
		className:       string,
		additionalTitle: string,
		optionState?:    optionState
	): void {
		const state = this.createBaseState(additionalTitle, this.guideGroupId, 0, itemId);

		if (optionState) {
			if (optionState.subState) {
				Object.assign(state, optionState.subState);
			}

			if (optionState.initialValue) {
				state["initailValue"] = optionState.initialValue;
			}
		}

		this.setNextSteps([{ key: className, state: state }]);
	}

	private async save(): Promise<void> {
		await this.registSetting();
		Wallpaper.delegation2Transition(this, this.state);
	}
}
