import { InputStep, MultiStepInput }                  from "../utils/multiStepInput";
import { State }                                      from "./base/base";
import { BaseInputGuide, InputResourceGuide, Type }   from "./base/input";
import { BaseQuickPickGuide }                         from "./base/pick";
import { BaseValidator }                              from "./validator/base";
import { ExtensionSetting }                           from "../settings/extension";
import { messages, words, quickpicks, values, types } from "../constant";
import * as Wallpaper                                 from "./select/wallpaper";

export function getDefaultState(itemId: string): Partial<State> {
	const state: Partial<State> = {};

	state.itemId                = itemId;

	switch (itemId) {
		case ExtensionSetting.propertyIds.slideFilePaths:
			state.prompt      = messages.placeholder.slide.filePaths;
			break;
		case ExtensionSetting.propertyIds.slideInterval:
			state.validate    = SlideIntervalGuide.validateSlideInterval;
			break;
		case ExtensionSetting.propertyIds.slideIntervalUnit:
			state.placeholder = messages.placeholder.slide.interval.unit;
			state.items       = quickpicks.slide.interval.unit;
			break;
		case ExtensionSetting.propertyIds.slideRandomPlay:
			state.placeholder = messages.placeholder.slide.randomPlay;
			state.items       = quickpicks.slide.randomPlay;
			break;
		case ExtensionSetting.propertyIds.slideEffectFadeIn:
			state.placeholder = messages.placeholder.slide.effectFadeIn;
			state.items       = quickpicks.slide.effectFadeIn;
			break;
		case ExtensionSetting.propertyIds.slideLoadWaitComplete:
			state.placeholder = messages.placeholder.slide.loadWaitComplete;
			state.items       = quickpicks.slide.loadWaitComplete;
	}

	return state;
}

export class SlideFilePathsGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		super(state, Type.Directory);
	}
}

export class SlideIntervalGuide extends BaseInputGuide {
	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.prompt = messages.placeholder.slide.interval.time(
			values.slide.min,
			(
				this.guideGroupResultSet[this.itemIds.slideIntervalUnit]
					? this.guideGroupResultSet[this.itemIds.slideIntervalUnit]
					: this.settings.slideIntervalUnit.value
			)
		);

		await super.show(input);
	}

	public static async validateSlideInterval(slideInterval: string): Promise<string | undefined> {
		return await BaseValidator.validateNumber(words.slideInterval, slideInterval, { minimum: values.slide.min });
	}
}

export class SlideRandomPlayGuide extends BaseQuickPickGuide {
	public async after(): Promise<void> {
		await super.after();

		Wallpaper.installByType(this.state, types.wallpaper.slide);
	}
}
