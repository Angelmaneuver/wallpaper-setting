import { ExtensionContext } from "vscode";
import { State }            from "./base/base";
import { BaseInputGuide }   from "./base/input";
import { BaseValidator }    from "./validator/base";
import { ExtensionSetting } from "../settings/extension";
import * as Constant        from "../constant";

export class OpacityGuide extends BaseInputGuide {
	private static maximum: number;
	private static minimum: number;

	constructor(
		state:    State,
		context?: ExtensionContext
	) {
		super(state, context);

		OpacityGuide.maximum = this.settings.isAdvancedMode ? Constant.maximumOpacityWithAdvancedMode : Constant.maximumOpacity;
		OpacityGuide.minimum = Constant.minimumOpacity;
	}

	public init(): void {
		super.init();

		this.itemId   = this.itemId ? this.itemId : this.itemIds.opacity;
		this.prompt   = this.prompt ? this.prompt : `Enter a number between ${OpacityGuide.maximum} and ${OpacityGuide.minimum} for opacity. (Default: 0.75)`;
		this.validate = OpacityGuide.validateOpacity;
	}

	public static async validateOpacity(opacity: string): Promise<string | undefined> {
		return await BaseValidator.validateNumber(
			ExtensionSetting.propertyIds.opacity,
			opacity,
			{
				minimum: OpacityGuide.maximum,
				maximum: OpacityGuide.minimum,
			}
		);
	}
}
