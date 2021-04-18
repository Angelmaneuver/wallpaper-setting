import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { State }                     from "./base/base";
import { BaseQuickPickGuide }        from "./base/pick";
import { VSCodePreset }              from "../utils/base/vscodePreset";

export class BaseConfirmGuide extends BaseQuickPickGuide {
	private callback: any;
	private args:     any;

	constructor(
		state:    State,
		description: {
			yes: string,
			no:  string
		},
		callback: any,
		...args:  any
	) {
		super(state);

		this.items      = [
			VSCodePreset.create(VSCodePreset.Icons.check, "Yes", description.yes),
			VSCodePreset.create(VSCodePreset.Icons.x,     "No",  description.no),
		];
		this.activeItem = this.items[1];
		this.callback   = callback;
		this.args       = args;
	}

	public async after():Promise<void> {
		if (this.activeItem === this.items[0] && this.callback) {
			await this.callback(...this.args);
		} else {
			this.prev();
		}
	}
}
