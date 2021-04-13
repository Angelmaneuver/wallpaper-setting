import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { State }                     from "./base/base";
import { BaseInputGuide }            from "./base/input";
import { BaseValidator }             from "./validator/base";
import { ExtensionSetting }          from "../settings/extension";
import { Constant }                  from "../constant";

export class OpacityGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		state.itemId   = ExtensionSetting.propertyIds.opacity;
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
			await this.settings.set(
				ExtensionSetting.propertyIds.filePath,
				this.state.resultSet[this.getId(ExtensionSetting.propertyIds.filePath)]
			);

			if (this.inputResult.length > 0) {
				await this.settings.set(this.itemId,  Number(this.inputResult));
			} else {
				await this.settings.remove(this.itemId);
			}

			this.installer.install();

			this.state.reload = true;
		}
	}

	public static async validateOpacity(opacity: string): Promise<string | undefined> {
		return await BaseValidator.validateNumber(
			ExtensionSetting.propertyIds.opacity,
			opacity,
			{
				minimum: Constant.maximumOpacity,
				maximum: Constant.minimumOpacity,
			}
		);
	}
}
