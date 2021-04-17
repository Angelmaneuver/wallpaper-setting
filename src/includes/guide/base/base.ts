import { AbstractState, AbstractGuide } from "./abc";
import { ExtensionContext }             from "vscode";
import { ExtensionSetting }             from "../../settings/extension";
import { Wallpaper }                    from "../../wallpaper";
import * as Installer                   from "../../installer";

export interface State extends AbstractState {
	context:   ExtensionContext,
	installer: Wallpaper,
	settings:  ExtensionSetting,
	message:   string           | undefined;
	reload:    boolean
}

export abstract class BaseGuide extends AbstractGuide {
	constructor(
		state:    State,
		context?: ExtensionContext
	) {
		super(state);

		if (context) {
			this.state.context = context;
		}
	}

	public get context(): ExtensionContext {
		if (this.state.context) {
			return this.state.context;
		} else {
			throw ReferenceError("Extension Context not set...");
		}
	}

	public get installer(): Wallpaper {
		if (!this.state.installer) {
			this.state.installer = Installer.getInstance(this.settings);
		}

		return this.state.installer;
	}

	public get settings(): ExtensionSetting {
		if (!this.state.settings) {
			this.state.settings = new ExtensionSetting();
		}

		return this.state.settings;
	}
}
