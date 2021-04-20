import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseQuickPickGuide }        from "../base/pick";
import { QuickPickItem }             from "vscode";
import { State }                     from "../base/base";
import { VSCodePreset }              from "../../utils/base/vscodePreset";
import * as Wallpaper                from "../select/wallpaper";
import * as Slide                    from "../slide";

type optionState = { subState?: Partial<State>, initialValue?: any };

export class SelectParameterType extends BaseQuickPickGuide {
	private static templateItems: QuickPickItem[]                = [
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

	private static item2GuideParameter: { [key: number]: any[] } = {};

	constructor(
		state: State,
	) {
		super(state);

		this.placeholder = "Select the item you want to set.";

		if (Object.keys(SelectParameterType.item2GuideParameter).length === 0) {
			this.initial();
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
		].concat(
			Object.keys(this.guideGroupResultSet).length > 0
				? SelectParameterType.templateItems[7]
				: []
		).concat(SelectParameterType.templateItems[8]);

		await super.show(input);
	}

	public async after(): Promise<void> {
		if (this.activeItem === SelectParameterType.templateItems[7]) {
			await this.save();
		} else if (this.activeItem === SelectParameterType.templateItems[8]) {
			this.prev();
		} else if (this.activeItem) {
			Reflect.apply(
				this.createNextStep,
				this,
				SelectParameterType.item2GuideParameter[SelectParameterType.templateItems.indexOf(this.activeItem)]
			);
		}
	}

	private initial(): void {
		SelectParameterType.item2GuideParameter = {
			0: [this.settingItemId.filePath,          "ImageFilePathGuide",   " - Image Path",            this.createOptionState(this.settingItemId.filePath)],
			1: [this.settingItemId.slideFilePaths,    "SlideFilePathsGuide",  " - Image Files Path",      this.createOptionState(this.settingItemId.slideFilePaths)],
			2: [this.settingItemId.opacity,           "OpacityGuide",         " - Opacity",               this.createOptionState(this.settingItemId.opacity)],
			3: [this.settingItemId.slideInterval,     "SlideIntervalGuide",   " - Slide Interval",        this.createOptionState(this.settingItemId.slideInterval)],
			4: [this.settingItemId.slideIntervalUnit, "BaseQuickPickGuide",   " - Slide Interval Unit",   this.createOptionState(this.settingItemId.slideIntervalUnit)],
			5: [this.settingItemId.slideRandomPlay,   "SlideRandomPlayGuide", " - Slide Random Playback", this.createOptionState(this.settingItemId.slideRandomPlay)],
			6: [this.settingItemId.slideEffectFadeIn, "BaseQuickPickGuide",   " - Slide Effect Fade In",  this.createOptionState(this.settingItemId.slideEffectFadeIn)]
		};
	}

	private createOptionState(itemId: string): optionState {
		let result: optionState = {};

		switch(itemId) {
			case this.settingItemId.slideFilePaths:
			case this.settingItemId.slideInterval:
			case this.settingItemId.slideIntervalUnit:
			case this.settingItemId.slideRandomPlay:
			case this.settingItemId.slideEffectFadeIn:
				result["subState"] = Slide.getDefaultState(itemId);
		}

		if (itemId !== this.settingItemId.slideFilePaths) {
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
		let state = this.createState(additionalTitle, this.guideGroupId, 0, itemId);

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
		Wallpaper.delegation2Transition(this, this.installer, this.settings, this.state);
	}
}
