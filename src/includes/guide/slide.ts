import { BaseInputGuide, InputResourceGuide, Type }  from "./base/input";
import { BaseQuickPickGuide }                        from "./base/pick";
import { State }                                     from "./base/base";
import { BaseValidator }                             from "./validator/base";
import { ExtensionSetting }                          from "../settings/extension";
import { Constant }                                  from "../constant";
import { File }                                      from "../utils/base/file";

export function getDefaultState(itemId: string): Partial<State> {
	let state: Partial<State> = {};

	state.itemId              = itemId;

	switch (itemId) {
		case ExtensionSetting.propertyIds.slideIntervalUnit:
			state.placeholder = "Select the unit of slide interval to enter next.";
			state.items       = Constant.slideIntervalUnit;
			break;
		case ExtensionSetting.propertyIds.slideEffectFadeIn:
			state.placeholder = "Do you want to fade in effect when the slide image changes?";
			state.items       = Constant.slideEffectFadeIn
			break;
	}

	return state;
}

export class SlideFilePathsGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		state.itemId = ExtensionSetting.propertyIds.slideFilePaths;
		state.prompt = "Enter the path of the folder that contains the image files you want to use for the slides, or select it from the dialog box that appears when you click the button in the upper right corner.";

		super(state, Type.Directory);
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
	constructor(
		state: State,
	) {
		state.itemId      = ExtensionSetting.propertyIds.slideRandomPlay;
		state.placeholder = "Do you want to randomize the sliding order of images?";
		state.items       = Constant.slideRandomPlay;

		super(state);
	}

	public async after(): Promise<void> {
		await super.after();
		
		if (this.totalSteps === 5) {
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

			await this.inputResult2SettingByNumber(ExtensionSetting.propertyIds.opacity);

			await this.inputResult2SettingByNumber(ExtensionSetting.propertyIds.slideInterval);

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
