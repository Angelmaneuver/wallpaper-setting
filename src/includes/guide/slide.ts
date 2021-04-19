import { InputStep, MultiStepInput }                 from "../utils/multiStepInput";
import { BaseInputGuide, InputResourceGuide, Type }  from "./base/input";
import { BaseQuickPickGuide }                        from "./base/pick";
import { State }                                     from "./base/base";
import { BaseValidator }                             from "./validator/base";
import { ExtensionSetting }                          from "../settings/extension";
import * as Constant                                 from "../constant";

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
		super(state, Type.Directory);

		this.itemId = this.settingItemId.slideFilePaths;
		this.prompt = "Enter the path of the folder that contains the image files you want to use for the slides, or select it from the dialog box that appears when you click the button in the upper right corner.";
	}
}

export class SlideIntervalGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		super(state);

		this.itemId    = this.settingItemId.slideInterval;
		this.validate = SlideIntervalGuide.validateSlideInterval;
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.prompt    =
		"Enter a number between "
			+ Constant.minimumSlideInterval
			+ " and 65555 in "
			+ (
				this.guideGroupResultSet[this.settingItemId.slideIntervalUnit]
					? this.guideGroupResultSet[this.settingItemId.slideIntervalUnit]
					: this.settings.slideIntervalUnit.value
			)
			+ ". (Default: 25)";

		await super.show(input);
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
		super(state);

		this.itemId      = this.settingItemId.slideRandomPlay;
		this.placeholder = "Do you want to randomize the sliding order of images?";
		this.items       = Constant.slideRandomPlay;
	}

	public async after(): Promise<void> {
		await super.after();
		
		if (this.totalSteps === 5) {
			await this.registSetting();
			this.installer.installAsSlide();
			this.state.reload = true;
		}
	}
}
