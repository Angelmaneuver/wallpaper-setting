import {
	QuickInputButton,
	QuickPickItem,
	ExtensionContext
}                           from "vscode";
import { 
	AbstractState,
	AbstractGuide
}                           from "./abc";
import { ExtensionSetting } from "../../settings/extension";
import { SettingSync }      from "../../settings/sync";
import * as Constant        from "../../constant";
import { File }             from "../../utils/base/file";
import { Wallpaper }        from "../../wallpaper";
import * as Installer       from "../../installer";

export interface State extends AbstractState {
	context:      ExtensionContext,
	installer:    Wallpaper,
	settings:     ExtensionSetting,
	sync:         SettingSync,
	message?:     string                  | undefined,
	reload?:      boolean,
	prompt?:      string,
	buttons?:     Array<QuickInputButton>,
	placeholder?: string,
	items?:       Array<QuickPickItem>,
	activeItem?:  QuickPickItem,
}

export abstract class AbstractBaseGuide extends AbstractGuide {
	constructor(
		state:    State,
		context?: ExtensionContext
	) {
		super(state);

		if (context) {
			this.state.context = context;
		}
	}

	protected stateClear(): void {
		super.stateClear();

		this.state.prompt      = undefined;
		this.state.buttons     = undefined;
		this.state.placeholder = undefined;
		this.state.items       = undefined;
		this.state.activeItem  = undefined;
	}

	protected get state(): State {
		return this._state as State;
	}

	protected get context(): ExtensionContext {
		if (this.state.context) {
			return this.state.context;
		} else {
			throw ReferenceError("Extension Context not set...");
		}
	}

	protected get installer(): Wallpaper {
		if (!this.state.installer) {
			this.state.installer = Installer.getInstance(this.settings);
		}

		return this.state.installer;
	}

	protected get settings(): ExtensionSetting {
		if (!this.state.settings) {
			this.state.settings = new ExtensionSetting();
		}

		return this.state.settings;
	}

	protected get itemIds(): Record<string, string> {
		return ExtensionSetting.propertyIds;
	}

	protected get sync(): SettingSync {
		if (!this.state.sync) {
			this.state.sync = SettingSync.getInstance(this.context);
		}

		return this.state.sync;
	}

	protected async inputStepAfter(): Promise<void> {
		if (this.totalSteps === 0) {
			this.prev();
		} else if (this.step === this.totalSteps) {
			await this.lastInputStepExecute();
		}
	}

	protected async lastInputStepExecute(): Promise<void> {
		await this.registSetting();
	}

	protected async registSetting(): Promise<void> {
		for (const key of Object.keys(this.guideGroupResultSet)) {
			if (key === this.itemIds.slideFilePaths) {
				this.setSlideFilePaths();
			}

			await this.settings.setItemValue(key, this.guideGroupResultSet[key]);
		}
	}

	private setSlideFilePaths(): void {
		const inputValue = this.guideGroupResultSet[this.itemIds.slideFilePaths];
		let slidePaths   = new Array<string>();
		let result       = new Array<string>();

		if (Array.isArray(inputValue)) {
			slidePaths = inputValue as Array<string>;
		} else if (typeof(inputValue) === "string") {
			slidePaths = [inputValue];
		}

		slidePaths.forEach( (slidePath) => {
			if (File.isFile(slidePath)) {
				result.push(slidePath);
			} else if (File.isDirectory(slidePath)) {
				const childrens = File.getChildrens(
					slidePath,
					{ filter: { extension: Constant.applyImageFile }, fullPath: true, recursive: false }
				);

				result = result.concat( childrens ? childrens : new Array<string>());
			}
		});

		this.guideGroupResultSet[this.itemIds.slideFilePaths] = result;
	}
}
