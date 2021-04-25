import {
	InputStep,
	MultiStepInput,
	InputFlowAction
}                       from "../../utils/multiStepInput";
import { GuideFactory } from "../factory/base";
import { Optional }     from "../../utils/base/optional";

export interface AbstractState{
	guideGroupId?: string,
	itemId?:       string,
	title:         string,
	step?:         number,
	totalSteps?:   number,
	initailValue?: unknown,
	validate?:     (arg: any) => Promise<any>,
	shouldResume?: () => Promise<boolean>,
	resultSet:     { [key: string]: any },
}

interface Guide{ key: string, state?: Partial<AbstractState>, args?: Array<any>}

const initialFields = [
	"guideGroupId", "itemId", "title", "step", "totalSteps", "initailValue", "inputResult", "validate", "shouldResume"
];

export abstract class AbstractGuide {
	protected _initialize                           = false;
	protected _state;
	protected initialFields: Array<string>              = initialFields;
	protected guideGroupId                              = "";
	protected itemId                                    = "";
	protected title                                     = "";
	protected step                                      = 0;
	protected totalSteps                                = 0;
	protected initailValue:  unknown                    = undefined;
	protected _inputValue:   unknown                    = undefined;
	protected validate:      (arg: any) => Promise<any> = async () => { return; };
	protected shouldResume:  () => Promise<boolean>     = async () => new Promise<boolean>((resolve, reject) => { return; });
	protected nextStep: any                             = undefined;

	constructor(state: AbstractState) {
		this._state = state;
	}

	public init(): void {
		this.initialFields.forEach(
			(key) => {
				Reflect.set(this, key, Optional.ofNullable(Reflect.get(this.state, key)).orElseNonNullable(Reflect.get(this, key)));
			}
		);

		if (this.totalSteps > 0) {
			this.step        += 1;
			this.state.step = this.step;
		}

		this.stateClear();

		this._initialize = true;
	}

	protected stateClear(): void {
		this.state.itemId       = undefined;
		this.state.initailValue = undefined;
		this.state.validate     = undefined;
		this.state.shouldResume = undefined;
	}

	protected get state(): AbstractState {
		return this._state;
	}

	protected set inputValue(value: unknown) {
		this._inputValue = value;
	}

	protected get inputValue(): unknown {
		return (
			this.guideGroupResultSet[this.itemId] !== undefined
				? this.guideGroupResultSet[this.itemId]
				: Optional.ofNullable(this._inputValue).orElseNonNullable(this.initailValue)
		);
	}

	protected get inputValueAsString(): string {
		return typeof(this.inputValue) === "string" ? this.inputValue : "";
	}

	protected get guideGroupResultSet(): { [key: string]: any } {
		if (!this.state.resultSet[this.guideGroupId]) {
			this.state.resultSet[this.guideGroupId] = {};
		}

		return this.state.resultSet[this.guideGroupId];
	}

	public setNextStep(guide: AbstractGuide): AbstractGuide {
		this.nextStep = guide;

		return guide;
	}

	public setNextSteps(guides: Array<Guide>): void {
		let guideInstances: undefined | AbstractGuide = undefined;
		let preInstance:    undefined | AbstractGuide = undefined;

		guides.forEach(
			(guide) => {
				if (guide.state) {
					Object.assign(this.state, guide.state);					
				}

				const args          = guide.args ? guide.args : [];
				const guideInstance = GuideFactory.create(guide.key, this.state, ...args);

				guideInstance.init();

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
		if (!this._initialize) {
			this.init();
		}

		await this.show(input);
		await this.after();

		if (this.nextStep instanceof AbstractGuide) {
			return () => this.nextStep.start(input);
		}

		await this.final();
	}

	abstract show(input: MultiStepInput): Promise<void | InputStep>;

	protected async after(): Promise<void> { return; }

	protected async final(): Promise<void> { return; }

	protected prev(): void {
		throw InputFlowAction.back;
	}
}
