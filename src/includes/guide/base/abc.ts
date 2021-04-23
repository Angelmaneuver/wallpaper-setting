import { InputStep, MultiStepInput, InputFlowAction } from "../../utils/multiStepInput";
import { QuickPickItem }                              from "vscode";
import { State }                                      from "./base";
import { GuideFactory }                               from "../factory/base";
import { Optional }                                   from "../../utils/base/optional";

export interface AbstractState{
	guideGroupId?: string,
	itemId?:       string,
	title:         string,
	step?:         number,
	totalSteps?:   number,
	buttons?:      Array<any>,
	placeholder?:  string,
	prompt?:       string,
	inputResult?:  any,
	items?:        Array<QuickPickItem>,
	activeItem?:   QuickPickItem,
	validate?:     any,
	shouldResume?: any, 
	initailValue?: any,
	resultSet:     {
		[key: string]: any,
	},
};

const initialFields = [
	"guideGroupId",
	"itemId",
	"title",
	"step",
	"totalSteps",
	"buttons",
	"placeholder",
	"prompt",
	"inputResult",
	"items",
	"activeItem",
	"validate",
	"shouldResume",
	"initailValue"
];

export abstract class AbstractGuide {
	protected _state:        State;
	protected _initialize:   boolean                     = false;
	protected initialFields: Array<string>               = initialFields;
	protected guideGroupId:  string                      = "";
	protected itemId:        string                      = "";
	protected title:         string                      = "";
	protected step:          number                      = 0;
	protected totalSteps:    number                      = 0;
	protected buttons:       Array<any>                  = [];
	protected placeholder:   string                      = "";
	protected prompt:        string                      = "";
	protected inputResult:   any                         = undefined;
	protected items:         Array<QuickPickItem>        = [];
	protected activeItem:    QuickPickItem   | undefined = undefined;
	protected validate:      any                         = () => undefined;
	protected shouldResume:  any                         = () => new Promise<boolean>((resolve, reject) => {});
	protected initailValue:  any                         = undefined;
	protected nextStep:      any                         = undefined;

	constructor(
		state: State
	) {
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

	private stateClear(): void {
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
	}

	abstract show(input: MultiStepInput): Promise<void | InputStep>;

	public async after(): Promise<void> {
		if (this.totalSteps === 0) {
			this.prev();
		} else if (this.step === this.totalSteps) {
			await this.final();
		}
	}

	abstract final(): Promise<void>;

	protected get inputValue(): any {
		return this.guideGroupResultSet[this.itemId] !== undefined ? this.guideGroupResultSet[this.itemId] : this.initailValue;
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
