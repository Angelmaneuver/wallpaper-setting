import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseQuickPickGuide }        from "../base/pick";
import { QuickPickItem }             from "vscode";
import { State }                     from "../base/base";
import { ExtensionSetting }          from "../../settings/extension";
import { VSCodePreset }              from "../../utils/base/vscodePreset";
import { Constant }                  from "../../constant";
import { File }                      from "../../utils/base/file";

export class SelectParameterType extends BaseQuickPickGuide {
	private templateItems:       QuickPickItem[];
	private imageId:             string;
	private slideId:             string;
	private opacityId:           string;
	private slideIntervalId:     string;
	private slideIntervalUnitId: string;
	private slideRandomPlayId:   string;
	private slideEffectFadeInId: string;

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
		this.imageId             = this.getId(ExtensionSetting.propertyIds.filePath);
		this.slideId             = this.getId(ExtensionSetting.propertyIds.slideFilePaths);
		this.opacityId           = this.getId(ExtensionSetting.propertyIds.opacity);
		this.slideIntervalId     = this.getId(ExtensionSetting.propertyIds.slideInterval);
		this.slideIntervalUnitId = this.getId(ExtensionSetting.propertyIds.slideIntervalUnit);
		this.slideRandomPlayId   = this.getId(ExtensionSetting.propertyIds.slideRandomPlay);
		this.slideEffectFadeInId = this.getId(ExtensionSetting.propertyIds.slideEffectFadeIn);
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
			Object.keys(this.state.resultSet).length > 0
				? this.templateItems[7]
				: []
		).concat(this.templateItems[8]);

		await super.show(input);
	}

	public async after(): Promise<void> {
		switch (this.activeItem) {
			case this.templateItems[0]:
				this.state.inputResult =
					this.state.resultSet[this.imageId]
						? this.state.resultSet[this.imageId]
						: this.settings.filePath;
				this.setNextSteps(this.title + " - Image Path",            this.guideGroupId, 0, 0, [{ key: "ImageFilePathGuide" }]);
				break;
			case this.templateItems[1]:
				this.setNextSteps(this.title + " - Image Files Path",      this.guideGroupId, 0, 0, [{ key: "SlideFilePathsGuide" }]);
				break;
			case this.templateItems[2]:
				this.state.inputResult =
					typeof(this.state.resultSet[this.opacityId]) === "string"
						? this.state.resultSet[this.opacityId]
						: this.settings.opacity;
				this.setNextSteps(this.title + " - Opacity",               this.guideGroupId, 0, 0, [{ key: "OpacityGuide" }]);
				break;
			case this.templateItems[3]:
				this.state.inputResult =
					typeof(this.state.resultSet[this.slideIntervalId]) === "string"
						? this.state.resultSet[this.slideIntervalId]
						: this.settings.slideInterval;
				this.setNextSteps(this.title + " - Slide Interval",        this.guideGroupId, 0, 0, [{ key: "SlideIntervalGuide" }]);
				break;
			case this.templateItems[4]:
				this.state.activeItem  =
					this.state.resultSet[this.slideIntervalUnitId]
						? this.state.resultSet[this.slideIntervalUnitId]
						: Constant.slideIntervalUnit.find(
							(item) => {
								return item.label === this.settings.slideIntervalUnit;
							}
						);
				this.setNextSteps(this.title + " - Slide Interval Unit",   this.guideGroupId, 0, 0, [{ key: "SlideIntervalUnitGuide" }]);
				break;
			case this.templateItems[5]:
				this.state.activeItem  =
					this.state.resultSet[this.slideRandomPlayId]
						? this.state.resultSet[this.slideRandomPlayId]
						: (this.settings.slideRandomPlay ? Constant.slideRandomPlay[0] : Constant.slideRandomPlay[1]);
				this.setNextSteps(this.title + " - Slide Random Playback", this.guideGroupId, 0, 0, [{ key: "SlideRandomPlayGuide" }]);
				break;
			case this.templateItems[6]:
				this.state.activeItem  =
					this.state.resultSet[this.slideEffectFadeInId]
						? this.state.resultSet[this.slideEffectFadeInId]
						: (this.settings.slideEffectFadeIn ? Constant.slideEffectFadeIn[0] : Constant.slideEffectFadeIn[1]);
				this.setNextSteps(this.title + " - Slide Effect Fade In", this.guideGroupId, 0, 0, [{ key: "SlideEffectFadeInGuide" }]);
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
		if (this.state.resultSet) {
			if (this.state.resultSet[this.imageId]) {
				await this.settings.set(ExtensionSetting.propertyIds.filePath, this.state.resultSet[this.imageId]);
			}

			if (this.state.resultSet[this.slideId]) {
				await this.settings.set(
					ExtensionSetting.propertyIds.slideFilePaths,
					File.getChldrens(
						this.state.resultSet[this.slideId],
						{
							filters:   Constant.applyImageFile,
							fullPath:  true,
							recursive: false,
						}
					)
				);
			}

			if (typeof(this.state.resultSet[this.opacityId]) === "string") {
				if (this.state.resultSet[this.opacityId].length > 0) {
					await this.settings.set(
						ExtensionSetting.propertyIds.opacity,
						Number(this.state.resultSet[this.opacityId])
					);
				} else {
					await this.settings.remove(ExtensionSetting.propertyIds.opacity);
				}
			}

			if (this.state.resultSet[this.slideIntervalUnitId]) {
				await this.settings.set(
					ExtensionSetting.propertyIds.slideIntervalUnit,
					this.state.resultSet[this.slideIntervalUnitId].label
				);
			}

			if (typeof(this.state.resultSet[this.slideIntervalId]) === "string") {
				if (this.state.resultSet[this.slideIntervalId].length > 0) {
					await this.settings.set(
						ExtensionSetting.propertyIds.slideInterval,
						Number(this.state.resultSet[this.slideIntervalId])
					);
				} else {
					await this.settings.remove(ExtensionSetting.propertyIds.slideInterval);
				}
			}

			if (this.state.resultSet[this.slideRandomPlayId]) {
				if (this.state.resultSet[this.slideRandomPlayId] === Constant.slideRandomPlay[0]) {
					await this.settings.set(ExtensionSetting.propertyIds.slideRandomPlay, true);
				} else {
					await this.settings.remove(ExtensionSetting.propertyIds.slideRandomPlay);
				}
			}

			if (this.state.resultSet[this.slideEffectFadeInId]) {
				if (this.state.resultSet[this.slideEffectFadeInId] === Constant.slideEffectFadeIn[0]) {
					await this.settings.remove(ExtensionSetting.propertyIds.slideEffectFadeIn);
				} else {
					await this.settings.set(ExtensionSetting.propertyIds.slideEffectFadeIn, false);
				}
			}
		}

		if (this.installer.isAutoSet === undefined) {
			if (this.settings.favoriteRandomSet) {
				this.state.reload = true;
			} else {
				this.setNextSteps(this.title + " - Select Setup Type", "", 0, 0, [{ key: "SelectSetupType" }]);
			}
		} else {
			switch (this.installer.isAutoSet) {
				case Constant.wallpaperType.Image:
					this.installer.install();
					break;
				case Constant.wallpaperType.Slide:
					this.installer.installAsSlide();
					break;
				default:
					break;
			}

			this.state.reload = true;
		}
	}
}
