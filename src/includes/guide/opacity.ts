import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { State }                     from "./base/base";
import { BaseInputGuide }            from "./base/input";
import { Constant }                  from "../constant";
import { BaseValidator }             from "./validator/base";
import { ImageFilePathGuide }        from "./image";

export class OpacityGuide extends BaseInputGuide {
	public static itemId = "opacity";

	constructor(
		state: State,
	) {
		state.itemId   = OpacityGuide.itemId;
		state.prompt   =
			"Enter a number between "
				+ Constant.maximumOpacity
				+ " and "
				+ Constant.minimumOpacity
				+ " for opacity."
				+ " (Default: 0.75)";
		state.validate = OpacityGuide.validateOpacity;

		super(state);
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		await super.show(input);

		if (this.totalSteps === 0) {
			this.prev();
		} else if (this.totalSteps === 2) {
			await this.settings.set(ImageFilePathGuide.itemId, this.state.resultSet[this.getId(ImageFilePathGuide.itemId)]);

			if (this.inputResult.length > 0) {
				await this.settings.set(OpacityGuide.itemId,  Number(this.inputResult));
			} else {
				await this.settings.remove(OpacityGuide.itemId);
			}

			this.installer.install();

			this.state.reload = true;
		}
	}

	public static async validateOpacity(opacity: string): Promise<string | undefined> {
		return await BaseValidator.validateNumber(
			OpacityGuide.itemId,
			opacity,
			{
				minimum: Constant.maximumOpacity,
				maximum: Constant.minimumOpacity,
			}
		);
	}
}
