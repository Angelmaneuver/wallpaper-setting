import { BaseInputGuide }   from "./base/input";
import { BaseValidator }    from "./validator/base";
import { ExtensionSetting } from "../settings/extension";
import * as Constant        from "../constant";
import * as Wallpaper       from "./select/wallpaper";

export class OpacityGuide extends BaseInputGuide {
	public init(): void {
		super.init();

		this.itemId   = this.itemIds.opacity;
		this.prompt   = `Enter a number between ${Constant.maximumOpacity} and ${Constant.minimumOpacity} for opacity. (Default: 0.75)`;
		this.validate = OpacityGuide.validateOpacity;
	}

	protected async lastInputStepExecute(): Promise<void> {
		await super.lastInputStepExecute();

		Wallpaper.installByType(this.state, Constant.wallpaperType.Image);
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
