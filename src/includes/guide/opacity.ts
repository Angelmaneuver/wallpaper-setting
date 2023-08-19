import { ExtensionContext } from "vscode";
import { State }            from "./base/base";
import { BaseInputGuide }   from "./base/input";
import { BaseValidator }    from "./validator/base";
import { ExtensionSetting } from "../settings/extension";
import { messages, values } from "../constant";

export class OpacityGuide extends BaseInputGuide {
	private static maximum: number;
	private static minimum: number;

	constructor(
		state:    State,
		context?: ExtensionContext
	) {
		super(state, context);

		OpacityGuide.maximum = values.opacity.max;
		OpacityGuide.minimum = values.opacity.min;
	}

	public init(): void {
		super.init();

		this.itemId   = this.itemId ? this.itemId : this.itemIds.opacity;
		this.prompt   = this.prompt ? this.prompt : messages.placeholder.opacity(OpacityGuide.minimum, OpacityGuide.maximum);
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
