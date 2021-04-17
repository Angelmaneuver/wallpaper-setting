import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { BaseGuide }                 from "./base";

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
				activeItem:   this.activeItem,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		if (this.id.length > 0) {
			this.state.resultSet[this.id] = this.activeItem;
		}
	}
}
