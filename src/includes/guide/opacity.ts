import { BaseInputGuide }            from "./base/input";
import { State }                     from "./base/base";
import { BaseValidator }             from "./validator/base";
import { ExtensionSetting }          from "../settings/extension";
import * as Constant                 from "../constant";

export class OpacityGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		super(state);

		this.itemId   = this.settingItemId.opacity;
		this.prompt   =
			"Enter a number between "
				+ Constant.maximumOpacity
				+ " and "
				+ Constant.minimumOpacity
				+ " for opacity."
				+ " (Default: 0.75)";
		this.validate = OpacityGuide.validateOpacity;
	}

	public async after():Promise<void> {
		await super.after();

		if (this.totalSteps === 2) {
			await this.registSetting();
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
