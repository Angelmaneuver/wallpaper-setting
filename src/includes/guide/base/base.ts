import * as path                        from "path";
import { ExtensionContext }             from "vscode";
import { AbstractState, AbstractGuide } from "./abc";
import { Wallpaper }                    from "../../wallpaper";
import { ExtensionSetting }             from "../../settings/extension";

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
			this.state.installer = new Wallpaper(
				(() => {
					let result: string | undefined;

					if (require.main?.filename) {
						result = require.main?.filename;
						console.debug('Use "require.main?.filename"');
					} else {
						result = process.mainModule?.filename;
						console.debug('Use "process.mainModule?.filename"');
					}
			
					return result ? path.dirname(result) : "";
				})(),
				"bootstrap-window.js",
				this.settings,
				"wallpaper-setting"
			);
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
