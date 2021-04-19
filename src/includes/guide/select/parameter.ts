import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseQuickPickGuide }        from "../base/pick";
import { QuickPickItem }             from "vscode";
import { State }                     from "../base/base";
import { ExtensionSetting }          from "../../settings/extension";
import { VSCodePreset }              from "../../utils/base/vscodePreset";
import * as Wallpaper                from "../select/wallpaper";
import * as Slide                    from "../slide";

export class SelectParameterType extends BaseQuickPickGuide {
	private templateItems:       QuickPickItem[];

	constructor(
		state: State,
	) {
		state.placeholder = "Select the item you want to set.";

		super(state);

		this.templateItems       = [
			VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image Path",            "Set the image to be used as the wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.folder,    "Image Files Path",      "Set the images to be used as the slide."),
			VSCodePreset.create(VSCodePreset.Icons.eye,       "Opacity",               "Set the opacity of the wallpaper."),
			VSCodePreset.create(VSCodePreset.Icons.clock,     "Slide Interval",        "Set the slide interval."),
			VSCodePreset.create(VSCodePreset.Icons.law,       "Slide Interval's Unit", "Set the slide interval's unit."),
			VSCodePreset.create(VSCodePreset.Icons.merge,     "Slide Random Playback", "set whether to play the slides randomly."),
			VSCodePreset.create(VSCodePreset.Icons.foldDown,  "Effect Fade in",        "set whether to use fade in effect."),
			VSCodePreset.create(VSCodePreset.Icons.save,      "Save",                  "Save changes."),
			VSCodePreset.create(VSCodePreset.Icons.mailReply, "Return",                "Return without saving any changes."),
		];
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.items = [
			this.templateItems[0],
			this.templateItems[1],
			this.templateItems[2],
			this.templateItems[3],
			this.templateItems[4],
			this.templateItems[5],
			this.templateItems[6]
		].concat(
			Object.keys(this.guideGroupResultSet).length > 0
				? this.templateItems[7]
				: []
		).concat(this.templateItems[8]);

		await super.show(input);
	}

	public async after(): Promise<void> {
		let state: Partial<State>;

		switch (this.activeItem) {
			case this.templateItems[0]:
				this.createNextStep(this.settingItemId.filePath,          "ImageFilePathGuide",  " - Image Path",
					{ initialValue: this.settings.filePath.value }
				);
				break;
			case this.templateItems[1]:
				this.createNextStep(this.settingItemId.slideFilePaths,    "SlideFilePathsGuide", " - Image Files Path",
					{ subState: Slide.getDefaultState(this.settingItemId.slideFilePaths) }
				);
				break;
			case this.templateItems[2]:
				this.createNextStep(this.settingItemId.opacity,           "OpacityGuide",        " - Opacity",
					{ initialValue: this.settings.opacity.value }
				);
				break;
			case this.templateItems[3]:
				this.createNextStep(this.settingItemId.slideInterval,     "SlideIntervalGuide",  " - Slide Interval",
					{ subState: Slide.getDefaultState(this.settingItemId.slideInterval),               initialValue: this.settings.slideInterval.value }
				);
				break;
			case this.templateItems[4]:
				this.createNextStep(this.settingItemId.slideIntervalUnit, "BaseQuickPickGuide",  " - Slide Interval Unit",
					{ subState: Slide.getDefaultState(ExtensionSetting.propertyIds.slideIntervalUnit), initialValue: this.settings.slideIntervalUnit.validValue }
				);
				break;
			case this.templateItems[5]:
				this.createNextStep(this.settingItemId.slideRandomPlay, "SlideRandomPlayGuide",  " - Slide Random Playback",
					{ subState: Slide.getDefaultState(this.settingItemId.slideRandomPlay),             initialValue: this.settings.slideRandomPlay.value }
				);
				break;
			case this.templateItems[6]:
				this.createNextStep(this.settingItemId.slideEffectFadeIn, "BaseQuickPickGuide",  " - Slide Effect Fade In",
					{ subState: Slide.getDefaultState(ExtensionSetting.propertyIds.slideEffectFadeIn), initialValue: this.settings.slideEffectFadeIn.value }
				);
				break;
			case this.templateItems[7]:
				await this.save();
				break;
			default:
				this.prev();
				break;
		}
	}

	protected createNextStep(
		itemId:          string,
		className:       string,
		additionalTitle: string,
		optionState?:    {
			subState?:  Partial<State>,
			initialValue?: any,
		}
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
