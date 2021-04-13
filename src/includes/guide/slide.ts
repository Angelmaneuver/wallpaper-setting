import { InputStep, MultiStepInput }                 from "../utils/multiStepInput";
import { State }                                     from "./base/base";
import { BaseInputGuide, InputResourceGuide, Type }  from "./base/input";
import { BaseQuickPickGuide }                        from "./base/pick";
import { BaseValidator }                             from "./validator/base";
import { ExtensionSetting }                          from "../settings/extension";
import { File }                                      from "../utils/base/file";
import { Constant }                                  from "../constant";
import { VSCodePreset }                              from "../utils/base/vscodePreset";

export class SlideFilePathsGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		state.itemId = ExtensionSetting.propertyIds.slideFilePaths;
		state.prompt = "Enter the path of the folder that contains the image files you want to use for the slides, or select it from the dialog box that appears when you click the button in the upper right corner.";

		super(state, Type.Directory);
	}
}

export class SlideIntervalUnitGuide extends BaseQuickPickGuide {
	public static items  = ["Hour", "Minute", "Second", "MilliSecond"].map((label) => ({ label }));

	constructor(
		state: State,
	) {
		state.itemId      = ExtensionSetting.propertyIds.slideIntervalUnit;
		state.placeholder = "Select the unit of slide interval to enter next.";
		state.items       = SlideIntervalUnitGuide.items;

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		await super.show(input);
		
		if (this.totalSteps === 0) {
			this.prev();
		}
	}
}

export class SlideIntervalGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		state.itemId   = ExtensionSetting.propertyIds.slideInterval;
		state.validate = SlideIntervalGuide.validateSlideInterval;

		super(state);

		this.prompt    =
			"Enter a number between "
				+ Constant.minimumSlideInterval
				+ " and 65555 in "
				+ (
					state.resultSet[this.getId(ExtensionSetting.propertyIds.slideIntervalUnit)]
						? state.resultSet[this.getId(ExtensionSetting.propertyIds.slideIntervalUnit)].label
						: this.settings.slideIntervalUnit
				)
				+ ". (Default: 25)";
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		await super.show(input);

		if (this.totalSteps === 0) {
			this.prev();
		}
	}

	public static async validateSlideInterval(slideInterval: string): Promise<string | undefined> {
		return await BaseValidator.validateNumber(
			"slide interval",
			slideInterval,
			{
				minimum: Constant.minimumSlideInterval,
			}
		);
	}
}

export class SlideRandomPlayGuide extends BaseQuickPickGuide {
	public static items  = [
		VSCodePreset.create(VSCodePreset.Icons.check, "Yes", "Random"),
		VSCodePreset.create(VSCodePreset.Icons.x,     "No",  "Not random"),
	];

	constructor(
		state: State,
	) {
		state.itemId      = ExtensionSetting.propertyIds.slideRandomPlay;
		state.placeholder = "Do you want to randomize the sliding order of images?";
		state.items       = SlideRandomPlayGuide.items;

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		await super.show(input);
		
		if (this.totalSteps === 0) {
			this.prev();
		} else if (this.totalSteps === 5) {
			await this.settings.set(
				ExtensionSetting.propertyIds.slideFilePaths,
				File.getChldrens(
					this.state.resultSet[this.getId(ExtensionSetting.propertyIds.slideFilePaths)],
					{
						filters:   Constant.applyImageFile,
						fullPath:  true,
						recursive: false,
					}
				)
			);

			if (
				this.state.resultSet[this.getId(ExtensionSetting.propertyIds.opacity)] &&
				this.state.resultSet[this.getId(ExtensionSetting.propertyIds.opacity)].length > 0
			) {
				await this.settings.set(
					ExtensionSetting.propertyIds.opacity, 
					Number(this.state.resultSet[this.getId(ExtensionSetting.propertyIds.opacity)])
				);
			} else {
				await this.settings.remove(ExtensionSetting.propertyIds.opacity);
			}

			await this.settings.set(
				ExtensionSetting.propertyIds.slideIntervalUnit,
				this.state.resultSet[this.getId(ExtensionSetting.propertyIds.slideIntervalUnit)].label
			);

			if (
				this.state.resultSet[this.getId(ExtensionSetting.propertyIds.slideInterval)] &&
				this.state.resultSet[this.getId(ExtensionSetting.propertyIds.slideInterval)].length > 0
			) {
				await this.settings.set(
					ExtensionSetting.propertyIds.slideInterval,
					Number(this.state.resultSet[this.getId(ExtensionSetting.propertyIds.slideInterval)])
				);
			} else {
				await this.settings.remove(ExtensionSetting.propertyIds.slideInterval);
			}

			if (this.activeItem === this.items[0]) {
				await this.settings.set(ExtensionSetting.propertyIds.slideRandomPlay, true);
			} else {
				await this.settings.remove(ExtensionSetting.propertyIds.slideRandomPlay);
			}

			this.installer.installAsSlide();
			this.state.reload = true;
		}
	}
}

export class SlideEffectFadeInGuide extends BaseQuickPickGuide {
	public static items  = [
		VSCodePreset.create(VSCodePreset.Icons.check, "Yes", "Fade in effect"),
		VSCodePreset.create(VSCodePreset.Icons.x,     "No",  "Not effect"),
	];

	constructor(
		state: State,
	) {
		state.itemId      = ExtensionSetting.propertyIds.slideEffectFadeIn;
		state.placeholder = "Do you want to fade in effect when the slide image changes?";
		state.items       = SlideEffectFadeInGuide.items;

		super(state);
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		await super.show(input);
		
		if (this.totalSteps === 0) {
			this.prev();
		}
	}
}
