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
		this.inputValue = await input.showInputBox(
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

		this.setResultSet(this.inputValue);
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
	filters?:          { [key: string]: Array<string> },	
}

export class InputResourceGuide extends BaseInputGuide {
	private type:    number;
	private options: Options;

	constructor(
		state: State,
		type:  number,
	) {
		super(state);

		this.type    = type;
		this.options =
			this.type === Type.File
				? { filters: { Images: Constant.applyImageFile } }
				: { canSelectFolders: true, canSelectFiles: false };
		this.buttons = [
			new GuideButton(
				{
					dark:  Uri.file(this.context.asAbsolutePath("resource/light/folder.svg")),
					light: Uri.file(this.context.asAbsolutePath("resource/light/folder.svg")),
				},
				"Open the dialog."
			)
		];
		this.validate = this.type === Type.File ? BaseValidator.validateFileExist : BaseValidator.validateDirectoryExist;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		do {
			await super.show(input);

			if (this.inputValue instanceof GuideButton) {
				await this.pushButton();
			}
		} while (
			!(this.inputValue)                                                      ||
			(typeof(this.inputValue) === "string" && this.inputValue.length === 0)
		);
	}

	private async pushButton(): Promise<void> {
		this.inputValue = undefined;
		const selected  = await new Selecter(this.options).openFileDialog();

		if (selected && selected.path.length > 0) {
			this.inputValue = selected.path;
			this.setResultSet(this.inputValue);
		}
	}
}
