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
		switch (this.activeItem) {
			case this.templateItems[0]:
				this.setNextSteps([{
					key: "ImageFilePathGuide", state: {
						title: this.title + " - Image Path", guideGroupId: this.guideGroupId, itemId: this.settingItemId.filePath, initailValue: this.settings.filePath.value
					}
				}]);
				break;
			case this.templateItems[1]:
				this.setNextSteps([{
					key: "SlideFilePathsGuide", state: {
						title: this.title + " - Image Files Path", guideGroupId: this.guideGroupId, itemId: this.settingItemId.slideFilePaths
					}
				}]);
				break;
			case this.templateItems[2]:
				this.setNextSteps([{
					key: "OpacityGuide", state: {
						title: this.title + " - Opacity", guideGroupId: this.guideGroupId, itemId: this.settingItemId.opacity, initailValue: this.settings.opacity.value
					}
				}]);
				break;
			case this.templateItems[3]:
				this.setNextSteps([{
					key: "SlideIntervalGuide", state: {
						title: this.title + " - Slide Interval", guideGroupId: this.guideGroupId, itemId: this.settingItemId.slideInterval, initailValue: this.settings.slideInterval.value
					}
				}]);
				break;
			case this.templateItems[4]:
				this.setNextSteps([{
					key: "BaseQuickPickGuide", state: Object.assign(
						{ title: this.title + " - Slide Interval Unit", guideGroupId: this.guideGroupId, initailValue: this.settings.slideIntervalUnit.validValue },
						Slide.getDefaultState(ExtensionSetting.propertyIds.slideIntervalUnit))
					}
				]);
				break;
			case this.templateItems[5]:
				this.setNextSteps([{
					key: "SlideRandomPlayGuide", state: {
						title: this.title + " - Slide Random Playback", guideGroupId: this.guideGroupId, itemId: this.settingItemId.slideRandomPlay, initailValue: this.settings.slideRandomPlay.value
					}
				}]);
				break;
			case this.templateItems[6]:
				this.setNextSteps([{
					key: "BaseQuickPickGuide", state: Object.assign(
						{ title: this.title + " - Slide Effect Fade In",  guideGroupId: this.guideGroupId, initailValue: this.settings.slideEffectFadeIn.value },
						Slide.getDefaultState(ExtensionSetting.propertyIds.slideEffectFadeIn))
					}
				]);
				break;
			case this.templateItems[7]:
				await this.save();
				break;
			default:
				this.prev();
				break;
		}
	}

	private async save(): Promise<void> {
		await this.registSetting();
		Wallpaper.delegation2Transition(this, this.installer, this.settings, this.state);
	}
}
