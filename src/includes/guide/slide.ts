import { InputStep, MultiStepInput }                 from "../utils/multiStepInput";
import { State }                                     from "./base/base";
import { BaseInputGuide, InputResourceGuide, Type }  from "./base/input";
import { BaseQuickPickGuide }                        from "./base/pick";
import { OpacityGuide }                              from "./opacity";
import { Constant }                                  from "../constant";
import { BaseValidator }                             from "./validator/base";
import { File }                                      from "../utils/base/file";

export class SlideFilePathsGuide extends InputResourceGuide {
	public static itemId = "slideFilePaths";

	constructor(
		state: State,
	) {
		state.itemId = SlideFilePathsGuide.itemId;
		state.prompt = "Enter the path of the folder that contains the image files you want to use for the slides, or select it from the dialog box that appears when you click the button in the upper right corner.";

		super(state, Type.Directory);
	}
}

export class SlideIntervalUnitGuide extends BaseQuickPickGuide {
	public static itemId = "slideIntervalUnit";

	constructor(
		state: State,
	) {
		state.itemId      = SlideIntervalUnitGuide.itemId;
		state.placeholder = "Select the unit of slide interval to enter next.";
		state.items       = Constant.slideIntervalUnit;

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
	public static itmeId = "slideInterval";

	constructor(
		state: State,
	) {
		state.itemId   = SlideIntervalGuide.itmeId;
		state.validate = SlideIntervalGuide.validateSlideInterval;

		super(state);

		this.prompt    =
			"Enter a number between "
				+ Constant.minimumSlideInterval
				+ " and 65555 in "
				+ (state.resultSet[this.id] ? state.resultSet[this.id].label : this.settings.slideIntervalUnit)
				+ ". (Default: 25)";
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		await super.show(input);

		if (this.totalSteps === 0) {
			this.prev();
		} else if (this.totalSteps === 4) {
			await this.settings.set(
				SlideFilePathsGuide.itemId,
				File.getChldrens(
					this.state.resultSet[this.getId(SlideFilePathsGuide.itemId)],
					{
						filters:   Constant.applyImageFile,
						fullPath:  true,
						recursive: false,
					}
				)
			);

			if (
				this.state.resultSet[this.getId(OpacityGuide.itemId)] &&
				this.state.resultSet[this.getId(OpacityGuide.itemId)].length > 0
			) {
				await this.settings.set(OpacityGuide.itemId,  Number(this.state.resultSet[this.getId(OpacityGuide.itemId)]));
			} else {
				await this.settings.remove(OpacityGuide.itemId);
			}

			await this.settings.set(SlideIntervalUnitGuide.itemId, this.state.resultSet[this.getId(SlideIntervalUnitGuide.itemId)].label);

			if (this.inputResult.length > 0) {
				await this.settings.set(SlideIntervalGuide.itmeId, Number(this.inputResult));
			} else {
				await this.settings.remove(SlideIntervalGuide.itmeId);
			}

			this.installer.installAsSlide();
			this.state.reload = true;
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
