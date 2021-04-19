import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { State, BaseGuide }          from "./base";
import { QuickInputButton, Uri }     from "vscode";
import { BaseValidator }             from "../validator/base";
import { Selecter }                  from "../../utils/selecter";
import * as Constant                 from "../../constant";

export class BaseInputGuide extends BaseGuide {
	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.inputResult = await input.showInputBox(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				buttons:      this.buttons,
				value:        this.inputValue,
				prompt:       this.prompt,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		this.setResultSet(this.inputResult);
	}

	protected setResultSet(value: any): void {
		if (this.itemId.length > 0 && typeof(value) === "string") {
			this.guideGroupResultSet[this.itemId] = value;
		}
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

export class InputResourceGuide extends BaseInputGuide {
	private type:    number;
	private options: {};

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

			if (this.inputResult instanceof GuideButton) {
				this.inputResult = undefined;
				const selected   = await new Selecter(this.options).openFileDialog();

				if (selected) {
					this.inputResult = selected.path;
					this.setResultSet(this.inputResult);
				}
			}
		} while (!(this.inputResult) || this.inputResult.length === 0);
	}
}
