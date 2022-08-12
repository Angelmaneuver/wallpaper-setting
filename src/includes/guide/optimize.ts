import { State }            from "./base/base";
import {
	Type,
	BaseInputResourceGuide,
} from "./base/input";
import * as Convert         from "../convert";

export class InputJsonFilePathGuide extends BaseInputResourceGuide {
	constructor(state: State) {
		super(state, Type.File, { Json: ['json'] });

		this.itemId = "json";
		this.prompt = "Enter the path of the color theme json file, or select it from the file dialog that appears by clicking the button on the upper right.";
	}

	protected async lastInputStepExecute(): Promise<void> {
		Convert.theme2transparancy(
			this.guideGroupResultSet["name"] as string,
			this.guideGroupResultSet["json"] as string,
			{
				base:      this.getValidOpacity(this.guideGroupResultSet["basic"]),
				overlap:   this.getValidOpacity(this.guideGroupResultSet["overlap"]),
				selection: this.getValidOpacity(this.guideGroupResultSet["selection"])
			}
		);

		this.state.message = "Optimized some color information for color theme.";
	}

	private getValidOpacity(value: unknown): string {
		if (typeof value === "string" && value.length > 0) {
			return value;
		} else {
			return "0.75";
		}
	}
}
