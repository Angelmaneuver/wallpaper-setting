import { QuickPickItem }             from "vscode";
import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { AbstractBaseGuide, State }  from "./base";

const match = /^\$\(.+\) /;

export abstract class AbstractQuickPickGuide extends AbstractBaseGuide {
	protected placeholder                           = "";
	protected items                                 = Array<QuickPickItem>();
	protected activeItem: QuickPickItem | undefined = undefined;

	public init(): void {
		this.initialFields.push("placeholder", "items", "activeItem");

		super.init();

		this.items = [];
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.nextStep   = this.totalSteps === 0 ? undefined : this.nextStep;
		this.activeItem = await input.showQuickPick(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				placeholder:  this.placeholder,
				items:        this.items,
				activeItem:   this.inputPick,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		if (this.itemId.length > 0) {
			this.guideGroupResultSet[this.itemId] = this.activeItem.label;
		}
	}

	protected get state(): State {
		return this._state as State;
	}

	protected get inputPick(): QuickPickItem | undefined {
		let label = this.inputValue;

		if (typeof(label) === "string") {
			label = label.replace(match, "");
			return this.items.find((item) => { return item.label.replace(match, "") === label; });
		} else {
			return this.activeItem;
		}
	}

	protected getItemByLabel(items: Array<QuickPickItem>, label: string): QuickPickItem | undefined {
		return items.find((item) => { return item.label === label; });
	}

	protected createBaseState(additionalTitle: string, guideGroupId: string, totalStep?: number, itemId?: string): Partial<State> {
		const state = { title: this.title + additionalTitle, guideGroupId: guideGroupId, step: 0, totalSteps: totalStep } as Partial<State>;

		if (totalStep) {
			state.totalSteps = totalStep;
		}

		if (itemId) {
			state.itemId = itemId;
		}

		return state;
	}
}

export abstract class AbstractQuickPickSelectGuide extends AbstractQuickPickGuide {
	public async after(): Promise<void> {
		const callback = this.getExecute(this.activeItem?.label);

		if (callback) {
			await callback();
		}
	}

	protected abstract getExecute(label: string | undefined): (() => Promise<void>) | undefined;
}


export class BaseQuickPickGuide extends AbstractQuickPickGuide {
	public async after(): Promise<void> {
		await this.inputStepAfter();
	}
}
