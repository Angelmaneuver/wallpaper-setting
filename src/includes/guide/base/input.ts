import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { AbstractBaseGuide, State }  from "./base";
import { QuickInputButton, Uri }     from "vscode";
import { BaseValidator }             from "../validator/base";
import { Selecter }                  from "../../utils/selecter";
import * as Constant                 from "../../constant";

export class BaseInputGuide extends AbstractBaseGuide {
	protected prompt  = "";
	protected buttons = new Array<QuickInputButton>();

	public init(): void {
		this.initialFields.push("buttons", "prompt");

		super.init();
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this._inputValue = await input.showInputBox(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				value:        this.inputValueAsString,
				prompt:       this.prompt,
				buttons:      this.buttons,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		this.setResultSet(this._inputValue);
	}

	protected setResultSet(value: unknown): void {
		if (typeof(value) === "string" && this.itemId.length > 0) {
			this.guideGroupResultSet[this.itemId] = value;
		}
	}

	protected async after(): Promise<void> {
		await this.inputStepAfter();
	}
}

class GuideButton implements QuickInputButton {
	constructor(
		public iconPath: { light: Uri; dark: Uri },
		public tooltip:  string
	) {}
}

export const Type = {
	File:      0,
	Directory: 1,
}

interface Options{
	canSelectFolders?: boolean,
	canSelectFiles?:   boolean,
	canSelectMany?:    boolean,
	openLabel?:        boolean,
	filters?:          Record<string, Array<string>>,	
}

export class BaseInputResourceGuide extends BaseInputGuide {
	private type:    number;
	private options: Options;

	constructor(
		state:   State,
		type:    number,
		filters: Record<string, Array<string>>
	) {
		super(state);

		this.type    = type;
		this.options =
			this.type === Type.File
				? { filters }
				: {
					canSelectFolders: true,
					canSelectMany:    true,
					filters:          filters,
				};
		this.state.buttons = [
			new GuideButton(
				{
					dark:  Uri.file(this.context.asAbsolutePath("resource/light/folder.svg")),
					light: Uri.file(this.context.asAbsolutePath("resource/light/folder.svg")),
				},
				"Open the dialog."
			)
		];
		this.state.validate = this.type === Type.File ? BaseValidator.validateFileExist : BaseValidator.validateDirectoryExist;

		BaseValidator.filters = filters[Object.keys(filters)[0]];
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		do {
			await super.show(input);

			if (this._inputValue instanceof GuideButton) {
				await this.pushButton();
			}
		} while (
			!this.guideGroupResultSet[this.itemId]
			|| (typeof(this.guideGroupResultSet[this.itemId]) === "string" && (this.guideGroupResultSet[this.itemId] as string).length === 0)
			|| (Array.isArray(this.guideGroupResultSet[this.itemId])       && (this.guideGroupResultSet[this.itemId] as Array<string>).length === 0)
		);
	}

	protected setResultSet(value: unknown): void {
		super.setResultSet(value);

		if (Array.isArray(value) && this.itemId.length > 0) {
			this.guideGroupResultSet[this.itemId] = value;
		}
	}

	private async pushButton(): Promise<void> {
		this._inputValue                      = undefined;
		this.guideGroupResultSet[this.itemId] = undefined;
		const selected  = await new Selecter(this.options).openFileDialog();

		if (selected && selected.paths.length > 0) {
			this._inputValue = this.type === Type.File ? selected.path : selected.paths;
			this.setResultSet(this._inputValue);
		}
	}
}

export class InputResourceGuide extends BaseInputResourceGuide {
	constructor(
		state: State,
		type:  number,
	) {
		super(state, type, { Images: Constant.applyImageFile });
	}
}
