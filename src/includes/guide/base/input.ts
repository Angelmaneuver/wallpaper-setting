import { QuickInputButton, Uri }     from "vscode";
import { InputStep, MultiStepInput } from "../../utils/multiStepInput";
import { State, BaseGuide }          from "./base";
import { Selecter }                  from "../../utils/selecter";
import { Constant }                  from "../../constant";
import { BaseValidator }             from "../validator/base";

export class BaseInputGuide extends BaseGuide {
	public async show(input: MultiStepInput):Promise<void | InputStep> {
		if (this.state.resultSet[this.id]) {
			this.inputResult = this.state.resultSet[this.id];
		}

		this.inputResult = await input.showInputBox(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				buttons:      this.buttons,
				value:        this.inputResult,
				prompt:       this.prompt,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		if (typeof (this.inputResult) === "string") {
			this.setResultSet(this.inputResult);
		}
	}

	protected setResultSet(value: any): void {
		if (this.id.length > 0) {
			this.state.resultSet[this.id] = value;
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
	private type: number;

	constructor(
		state: State,
		type:  number,
	) {
		super(state);

		this.type    = type;
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

				const options    =
					this.type === Type.File
						? { filters: { Images: Constant.applyImageFile } }
						: {
								canSelectFolders: true,
								canSelectFiles:   false,
						  };

				const selected   = await new Selecter(options).openFileDialog();

				if (selected) {
					this.inputResult = selected.path;
					this.setResultSet(this.inputResult);
				}
			}
		} while (!(this.inputResult) || this.inputResult.length === 0);

		if (this.totalSteps === 0) {
			this.prev();
		}
	}
}
