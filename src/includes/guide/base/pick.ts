import { QuickPickItem }             from "vscode";
import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseGuide }                 from "./base";

const match = /^\$\(.+\) /;

export class BaseQuickPickGuide extends BaseGuide {
	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.nextStep   = this.totalSteps === 0 ? undefined : this.nextStep;
		this.activeItem = await input.showQuickPick(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				placeholder:  this.placeholder,
				items:        this.items,
				activeItem:   this.inputValue,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		if (this.itemId.length > 0) {
			this.guideGroupResultSet[this.itemId] = this.activeItem.label;
		}
	}

	protected get inputValue(): QuickPickItem | undefined {
		let label = super.inputValue;

		if (typeof(label) === "string") {
			label = label.replace(match, "");
			return this.items.find((item) => { return item.label.replace(match, "") === label; });
		} else {
			return this.activeItem;
		}
	}
}
