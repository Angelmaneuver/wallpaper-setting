import { State }            from "./base/base";
import {
	Type,
	BaseInputResourceGuide,
} from "./base/input";
import * as Convert         from "../convert";
import { messages }         from "../constant";

export class InputJsonFilePathGuide extends BaseInputResourceGuide {
	constructor(state: State) {
		super(state, Type.File, { Json: ['json'] });

		this.itemId = "json";
		this.prompt = messages.placeholder.optimize.json;
	}

	protected async lastInputStepExecute(): Promise<void> {
		try {
			await Convert.theme2transparancy(
				this.guideGroupResultSet["name"] as string,
				this.guideGroupResultSet["json"] as string,
				{
					base:      this.getValidOpacity(this.guideGroupResultSet["basic"]),
					overlap:   this.getValidOpacity(this.guideGroupResultSet["overlap"]),
					selection: this.getValidOpacity(this.guideGroupResultSet["selection"])
				}
			);
	
			this.state.message = messages.showInformationMessage.optimize.success;
		} catch (e) {
			if (e instanceof Error) {
				this.state.message = messages.showInformationMessage.optimize.error(e);
			}
		}
	}

	private getValidOpacity(value: unknown): string {
		if (typeof value === "string" && value.length > 0) {
			return value;
		} else {
			return "0.75";
		}
	}
}
