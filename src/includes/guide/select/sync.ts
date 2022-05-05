import { Guide }                        from "../base/abc";
import { State }                        from "../base/base";
import { AbstractQuickPickSelectGuide } from "../base/pick";
import { QuickPickItem }                from "vscode";
import { BaseValidator }                from "../validator/base";
import { VSCodePreset }                 from "../../utils/base/vscodePreset";

export class SelectSyncProcess extends AbstractQuickPickSelectGuide {
	private static templateItems: Array<QuickPickItem>     = [
		VSCodePreset.create(VSCodePreset.Icons.debugStepOut,  "Sync Upload",   "Upload wallpaper settings."),
		VSCodePreset.create(VSCodePreset.Icons.debugStepInto, "Sync Download", "Download wallpaper settings and set."),
		VSCodePreset.create(VSCodePreset.Icons.trashcan,      "Sync Delete",   "Delete wallpaper settings."),
		VSCodePreset.create(VSCodePreset.Icons.reply,         "Return",        "Return without saving any changes."),
	];

	public init(): void {
		super.init();

		this.placeholder = "Select the process you want to perform.";
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
			const state = this.createBaseState(" - Upload", "upload", 4);

			this.setNextSteps([
				{ key: "SyncImageFilePathGuide",   state: state },
				{ key: "OpacityGuide" },
				this.getSyncPasswordInputGuide({ prompt: "Enter the password used to encrypt the image data." }),
				{ key: "SyncEncryptSaltInputGuide" },
			]);
		}
	}

	private download(): () => Promise<void> {
		return async () => {
			const state = this.createBaseState(" - Download", "download", 2);

			this.setNextSteps([
				this.getSyncPasswordInputGuide(
					Object.assign(
						state,
						{ prompt: "Enter the password used to decrypt the image data." }
					)
				),
				{ key: "SyncDecryptSaltInputGuide" },
			]);
		}
	}

	private delete(): () => Promise<void> {
		return async () => {
			this.state.placeholder = "Do you want to delete your wallpaper settings from Settings Sync?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title },
				args:  [
					{ yes: "Delete.", no: "Back to previous." },
					( async () => { this.sync.uninstall(); this.state.message = "Removed wallpaper settings from Settings Sync."; } )
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
