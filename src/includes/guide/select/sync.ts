import { Guide }                        from "../base/abc";
import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import { QuickPickItem }                from "vscode";
import { BaseValidator }                from "../validator/base";
import { VSCodePreset }                 from "../../utils/base/vscodePreset";
import { messages, words, quickpicks }  from "../../constant";

export class SelectSyncProcess extends AbstractQuickPickSelectGuide {
	private static templateItems: Array<QuickPickItem>     = [
		VSCodePreset.create(VSCodePreset.Icons.debugStepOut,  ...quickpicks.sync.upload),
		VSCodePreset.create(VSCodePreset.Icons.debugStepInto, ...quickpicks.sync.download),
		VSCodePreset.create(VSCodePreset.Icons.trashcan,      ...quickpicks.sync.delete),
		VSCodePreset.create(VSCodePreset.Icons.reply,         ...quickpicks.sync.return),
	];

	public init(): void {
		super.init();

		this.placeholder = messages.placeholder.sync.select.process;
		this.items       = [
			SelectSyncProcess.templateItems[0]
		].concat(
			this.sync.isAvailable ? SelectSyncProcess.templateItems[1] : []
		).concat(
			[SelectSyncProcess.templateItems[2], SelectSyncProcess.templateItems[3]]
		);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case SelectSyncProcess.templateItems[0].label:
				return this.upload();
			case SelectSyncProcess.templateItems[1].label:
				return this.download();
			case SelectSyncProcess.templateItems[2].label:
				return this.delete();
			default:
				return async () => { this.prev(); };
		}
	}

	private upload(): () => Promise<void> {
		return async () => {
			const state = this.createBaseState(words.headline.sync.upload, "upload", 4);

			this.setNextSteps([
				{ key: "SyncImageFilePathGuide",    state: state },
				{ key: "OpacityGuide" },
				this.getSyncPasswordInputGuide({ prompt: messages.placeholder.sync.upload.password }),
				{ key: "SyncEncryptSaltInputGuide", state: { prompt: messages.placeholder.sync.upload.salt }},
			]);
		}
	}

	private download(): () => Promise<void> {
		return async () => {
			const state = this.createBaseState(words.headline.sync.download, "download", 2);

			this.setNextSteps([
				this.getSyncPasswordInputGuide(
					Object.assign(
						state,
						{ prompt: messages.placeholder.sync.download.password }
					)
				),
				{ key: "SyncDecryptSaltInputGuide", state: { prompt: messages.placeholder.sync.download.salt } as Partial<State>},
			]);
		}
	}

	private delete(): () => Promise<void> {
		return async () => {
			this.state.placeholder = messages.placeholder.sync.delete;
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title },
				args:  [
					{ yes: "Delete.", no: "Back to previous." },
					( async () => { this.sync.uninstall(); this.state.message = messages.showInformationMessage.sync.success.delete; } )
				]
			}]);
		}
	}

	private getSyncPasswordInputGuide(state: Partial<State>): Guide {
		return {
			key:   "BaseInputGuide",
			state: Object.assign(
				state,
				{ itemId: "password", validate: BaseValidator.validateRequired }
			)
		};
	}
}
