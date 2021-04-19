import { InputStep, MultiStepInput, InputFlowAction } from "../../utils/multiStepInput";
import { QuickPickItem }                              from "vscode";
import { State }                                      from "./base";
import { GuideFactory }                               from "../factory/base";

export interface AbstractState{
	guideGroupId?: string,
	itemId?:       string,
	title:         string,
	step?:         number,
	totalSteps?:   number,
	buttons?:      any[],
	placeholder?:  string,
	prompt?:       string,
	inputResult?:  any,
	items?:        QuickPickItem[],
	activeItem?:   QuickPickItem,
	validate?:     any,
	shouldResume?: any, 
	initailValue?: any,
	resultSet:     {
		[key: string]: any,
	},
};

export abstract class AbstractGuide {
	protected _state:       State;
	protected guideGroupId: string;
	protected itemId:       string;
	protected title:        string;
	protected step:         number;
	protected totalSteps:   number;
	protected buttons:      any[];
	protected placeholder:  string;
	protected prompt:       string;
	protected inputResult:  any;
	protected items:        QuickPickItem[];
	protected activeItem:   QuickPickItem   | undefined;
	protected validate:     any;
	protected shouldResume: any;
	protected initailValue: any;
	protected nextStep:     any;

	constructor(
		state: State
	) {
		this._state       = state;
		this.guideGroupId = state.guideGroupId ? state.guideGroupId : "";
		this.itemId       = state.itemId       ? state.itemId       : "";
		this.title        = state.title;
		this.step         = state.step         ? state.step         : 0;
		this.totalSteps   = state.totalSteps   ? state.totalSteps   : 0;
		this.buttons      = state.buttons      ? state.buttons      : [];
		this.placeholder  = state.placeholder  ? state.placeholder  : "";
		this.prompt       = state.prompt       ? state.prompt       : "";
		this.inputResult  = state.inputResult  ? state.inputResult  : "";
		this.items        = state.items        ? state.items        : [];
		this.activeItem   = state.activeItem;
		this.validate     = state.validate     ? state.validate     : () => undefined;
		this.shouldResume = state.shouldResume ? state.shouldResume : () => new Promise<boolean>((resolve, reject) => {});
		this.initailValue = state.initailValue;

		if (this.totalSteps > 0) {
			this.step        += 1;
			this._state.step = this.step;
		}

		this.state.itemId       = undefined;
		this.state.buttons      = undefined;
		this.state.placeholder  = undefined;
		this.state.prompt       = undefined;
		this.state.inputResult  = undefined;
		this.state.items        = undefined;
		this.state.activeItem   = undefined;
		this.state.validate     = undefined;
		this.state.shouldResume = undefined;
		this.state.initailValue = undefined;
	}

	public get state(): State {
		return this._state;
	}

	public setNextStep(guide: AbstractGuide): AbstractGuide {
		this.nextStep = guide;

		return guide;
	}

	public setNextSteps(
		guides:       {
			key:    string,
			state?: Partial<State>,
			args?:  any[]
		}[],
	) {
		let guideInstances: undefined | AbstractGuide = undefined;
		let preInstance:    undefined | AbstractGuide = undefined;

		guides.forEach(
			(guide) => {
				if (guide.state) {
					Object.assign(this.state, guide.state);					
				}
				let   args          = guide.args ? guide.args : [];
				const guideInstance = GuideFactory.create(guide.key, this.state, ...args);

				if (guideInstances === undefined && preInstance === undefined) {
					guideInstances = guideInstance;
					preInstance    = guideInstance;
				} else {
					preInstance = preInstance?.setNextStep(guideInstance);
				}
			}
		);

		if (guideInstances) {
			this.setNextStep(guideInstances);
		}
	}

	public async start(input: MultiStepInput): Promise<void | InputStep> {
		await this.show(input);
		await this.after();

		if (this.nextStep instanceof AbstractGuide) {
			return () => this.nextStep.start(input);
		}
	}

	abstract show(input: MultiStepInput): Promise<void | InputStep>;

	public async after(): Promise<void> {
		if (this.totalSteps === 0) {
			this.prev();
		}
	}

	protected get inputValue(): any {
		return this.guideGroupResultSet[this.itemId] ? this.guideGroupResultSet[this.itemId] : this.initailValue;
	}

	protected get guideGroupResultSet(): { [key: string]: any } {
		if (!this.state.resultSet[this.guideGroupId]) {
			this.state.resultSet[this.guideGroupId] = {};
		}

		return this.state.resultSet[this.guideGroupId];
	}

	protected prev(): void {
		throw InputFlowAction.back;
	}
}
