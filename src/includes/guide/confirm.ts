import { State }                        from "./base/base";
import { AbstractQuickPickSelectGuide } from "./base/pick";
import * as Constant                    from "../constant";

export class BaseConfirmGuide extends AbstractQuickPickSelectGuide {
	private callback: (...args: Array<unknown>) => Promise<void>;
	private args:     Array<unknown>;

	constructor(
		state:       State,
		description: { yes: string, no:  string },
		callback:    (...args: Array<unknown>) => Promise<void>,
		...args:     Array<unknown>
	) {
		super(state);

		this.callback         = callback;
		this.args             = args;

		this.state.items      = Constant.itemsCreat(Constant.ItemType.Confirm, { item1: description.yes, item2: description.no });
		this.state.activeItem = this.state.items[1];
	}

	public getExecute(label: string | undefined): () => Promise<void> {
		switch (label) {
			case this.items[0].label:
				return async () => { await this.callback(...this.args); };
			default:
				return async () => { this.prev(); };
		}
	}
}
