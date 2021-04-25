import { InputStep, MultiStepInput }    from "../../utils/multiStepInput";
import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import { QuickPickItem }                from "vscode";
import { VSCodePreset }                 from "../../utils/base/vscodePreset";
import * as Wallpaper                   from "../select/wallpaper";
import * as Slide                       from "../slide";

type optionState = { subState?: Partial<State>, initialValue?: string };

export class SelectParameterType extends AbstractQuickPickSelectGuide {
	private static templateItems: Array<QuickPickItem>     = [
		VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image Path",            "Set the image to be used as the wallpaper."),
		VSCodePreset.create(VSCodePreset.Icons.folder,    "Image Files Path",      "Set the images to be used as the slide."),
		VSCodePreset.create(VSCodePreset.Icons.eye,       "Opacity",               "Set the opacity of the wallpaper."),
		VSCodePreset.create(VSCodePreset.Icons.clock,     "Slide Interval",        "Set the slide interval."),
		VSCodePreset.create(VSCodePreset.Icons.law,       "Slide Interval's Unit", "Set the slide interval's unit."),
		VSCodePreset.create(VSCodePreset.Icons.merge,     "Slide Random Playback", "set whether to play the slides randomly."),
		VSCodePreset.create(VSCodePreset.Icons.foldDown,  "Effect Fade in",        "set whether to use fade in effect."),
		VSCodePreset.create(VSCodePreset.Icons.save,      "Save",                  "Save changes."),
		VSCodePreset.create(VSCodePreset.Icons.reply,     "Return",                "Return without saving any changes."),
	];

	private guideParameters: { [key: number]: [string, string, string, optionState] } = {};

	public init(): void {
		super.init();

		this.placeholder     = "Select the item you want to set.";
		this.guideParameters = {
			0: [this.itemIds.filePath,          "ImageFilePathGuide",   " - Image Path",            this.createOptionState(this.itemIds.filePath)],
			1: [this.itemIds.slideFilePaths,    "SlideFilePathsGuide",  " - Image Files Path",      this.createOptionState(this.itemIds.slideFilePaths)],
			2: [this.itemIds.opacity,           "OpacityGuide",         " - Opacity",               this.createOptionState(this.itemIds.opacity)],
			3: [this.itemIds.slideInterval,     "SlideIntervalGuide",   " - Slide Interval",        this.createOptionState(this.itemIds.slideInterval)],
			4: [this.itemIds.slideIntervalUnit, "BaseQuickPickGuide",   " - Slide Interval Unit",   this.createOptionState(this.itemIds.slideIntervalUnit)],
			5: [this.itemIds.slideRandomPlay,   "SlideRandomPlayGuide", " - Slide Random Playback", this.createOptionState(this.itemIds.slideRandomPlay)],
			6: [this.itemIds.slideEffectFadeIn, "BaseQuickPickGuide",   " - Slide Effect Fade In",  this.createOptionState(this.itemIds.slideEffectFadeIn)]
		}
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.items = [
			SelectParameterType.templateItems[0],
			SelectParameterType.templateItems[1],
			SelectParameterType.templateItems[2],
			SelectParameterType.templateItems[3],
			SelectParameterType.templateItems[4],
			SelectParameterType.templateItems[5],
			SelectParameterType.templateItems[6]
		].concat(Object.keys(this.guideGroupResultSet).length > 0 ? SelectParameterType.templateItems[7] : []
		).concat(SelectParameterType.templateItems[8]);

		await super.show(input);
	}

	protected getExecute(): (() => Promise<void>) | undefined {
		if (this.activeItem === SelectParameterType.templateItems[7]) {
			return async () => { await this.save(); };
		} else if (this.activeItem === SelectParameterType.templateItems[8]) {
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
				result["subState"] = Slide.getDefaultState(itemId);
		}

		if (itemId === this.itemIds.slideRandomPlay || itemId === this.itemIds.slideEffectFadeIn) {
			result["initialValue"] = this.settings.getItem(itemId).value;
		} else if (itemId !== this.itemIds.slideFilePaths) {
			result["initialValue"] = this.settings.getItem(itemId).validValue;
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
