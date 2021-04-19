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
				state = this.createState(" - Image Path",            this.guideGroupId, 0, this.settingItemId.filePath);
				this.setNextSteps([{key: "ImageFilePathGuide", state: Object.assign(state,  { initailValue: this.settings.filePath.value })}]);
				break;
			case this.templateItems[1]:
				state = this.createState(" - Image Files Path",      this.guideGroupId, 0, this.settingItemId.slideFilePaths);
				this.setNextSteps([{key: "SlideFilePathsGuide", state: Object.assign(state, Slide.getDefaultState(this.settingItemId.slideFilePaths))}]);
				break;
			case this.templateItems[2]:
				state = this.createState(" - Opacity",               this.guideGroupId, 0, this.settingItemId.opacity);
				this.setNextSteps([{key: "OpacityGuide",        state: Object.assign(state, { initailValue: this.settings.opacity.value })}]);
				break;
			case this.templateItems[3]:
				state = this.createState(" - Slide Interval",        this.guideGroupId, 0, this.settingItemId.slideInterval);
				this.setNextSteps([{key: "SlideIntervalGuide",  state: Object.assign(state, { initailValue: this.settings.slideInterval.value}, Slide.getDefaultState(this.settingItemId.slideInterval))}]);
				break;
			case this.templateItems[4]:
				state = this.createState(" - Slide Interval Unit",   this.guideGroupId, 0, this.settingItemId.slideIntervalUnit);
				this.setNextSteps([{key: "BaseQuickPickGuide",  state: Object.assign(state, { initailValue: this.settings.slideIntervalUnit.validValue }, Slide.getDefaultState(ExtensionSetting.propertyIds.slideIntervalUnit))}]);
				break;
			case this.templateItems[5]:
				state = this.createState(" - Slide Random Playback", this.guideGroupId, 0, this.settingItemId.slideRandomPlay);
				this.setNextSteps([{key: "SlideRandomPlayGuide", state: Object.assign(state, { initailValue: this.settings.slideRandomPlay.value }, Slide.getDefaultState(this.settingItemId.slideRandomPlay))}]);
				break;
			case this.templateItems[6]:
				state = this.createState(" - Slide Effect Fade In",  this.guideGroupId, 0, this.settingItemId.slideEffectFadeIn);
				this.setNextSteps([{
					key: "BaseQuickPickGuide", state: Object.assign(state, { initailValue: this.settings.slideEffectFadeIn.value }, Slide.getDefaultState(ExtensionSetting.propertyIds.slideEffectFadeIn))}]);
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
