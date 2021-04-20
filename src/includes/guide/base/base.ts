import { AbstractState, AbstractGuide } from "./abc";
import { ExtensionContext }             from "vscode";
import { ExtensionSetting }             from "../../settings/extension";
import * as Constant                    from "../../constant";
import { File }                         from "../../utils/base/file";
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

	public async final(): Promise<void> {
		await this.registSetting();
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

	public get settingItemId(): { [key: string]: string } {
		return ExtensionSetting.propertyIds;
	}

	protected async registSetting(): Promise<void> {
		for (let key of Object.keys(this.guideGroupResultSet)) {
			if (key === this.settingItemId.slideFilePaths) {
				this.guideGroupResultSet[this.settingItemId.slideFilePaths] = File.getChldrens(
					this.guideGroupResultSet[this.settingItemId.slideFilePaths],
					{ filters: Constant.applyImageFile, fullPath: true, recursive: false }
				)	
			}

			await this.settings.setItemValue(key, this.guideGroupResultSet[key]);
		}
	}
}
