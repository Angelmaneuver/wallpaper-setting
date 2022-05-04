import { AbstractQuickPickSelectGuide } from "./base/pick";
import { ExtensionSetting }             from "../settings/extension";
import { VSCodePreset }                 from "../utils/base/vscodePreset";
import * as Wallpaper                   from "./select/wallpaper";
import * as Slide                       from "./slide";

const items = {
	Set:          VSCodePreset.create(VSCodePreset.Icons.debugStart,   "Set",         "Set wallpaper with current settings."),
	Reset:        VSCodePreset.create(VSCodePreset.Icons.debugRerun,   "Reset",       "Reset wallpaper with current settings."),
	Crear:        VSCodePreset.create(VSCodePreset.Icons.debugStop,    "Clear",       "Erase the wallpaper."),
	Setting:      VSCodePreset.create(VSCodePreset.Icons.settingsGear, "Setting",     "Set Parameters individually."),
	Favorite:     VSCodePreset.create(VSCodePreset.Icons.repo,         "Favorite",    "Configure settings related to favorites."),
	Setup:        VSCodePreset.create(VSCodePreset.Icons.fileMedia,    "Setup Image", "Set an image to wallpaper."),
	SetUpAsSlide: VSCodePreset.create(VSCodePreset.Icons.folder,       "Setup Slide", "Set an image slide to wallpaper."),
	Sync:         VSCodePreset.create(VSCodePreset.Icons.sync,         "Sync",        "Configure settings related to Sync."),
	Uninstall:    VSCodePreset.create(VSCodePreset.Icons.trashcan,     "Uninstall",   "Remove all parameters for this extension."),
	Exit:         VSCodePreset.create(VSCodePreset.Icons.signOut,      "Exit",        "Exit without saving any changes."),
};

export class StartMenuGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.placeholder   = "Select the item you want to do.";
		this.items         =
			this.items
			.concat(!this.installer.isInstall && this.installer.isReady                       ? [items.Set]                : [])
			.concat(this.installer.isInstall                                                  ? [items.Reset, items.Crear] : [])
			.concat(this.installer.isReady                                                    ? [items.Setting]            : [])
			.concat(this.installer.isReady                                                    ? [items.Favorite]           : [])
			.concat([items.Setup, items.SetUpAsSlide])
			.concat(this.settings.getItem(ExtensionSetting.propertyIds.enableSync).validValue ? [items.Sync]               : [])
			.concat([items.Uninstall, items.Exit]);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.Set.label:
			case items.Reset.label:
				return async () => { Wallpaper.delegation2Transition(this, this.state, true); };
			case items.Crear.label:
				return async () => { this.installer.uninstall(); this.state.reload = true; };
			case items.Setting.label:
				return async () => { this.setNextSteps([{ key: "SelectParameterType",   state: this.createBaseState(" - Individual Settings", "setting",  0) }]); };
			case items.Favorite.label:
				return async () => { this.setNextSteps([{ key: "SelectFavoriteProcess", state: this.createBaseState(" - Favorite Settings",   "favorite", 0) }]); };
			case items.Setup.label:
				return this.setup();
			case items.SetUpAsSlide.label:
				return this.setupAsSlide();
			case items.Sync.label:
				return async () => { this.setNextSteps([{ key: "SelectSyncProcess",     state: this.createBaseState(" - Sync",                "sync", 0) }]); };
			case items.Uninstall.label:
				return this.uninstall();
			default:
				return undefined;
		}
	}

	private setup(): () => Promise<void> {
		return async () => {
			this.setNextSteps([
				{ key: "ImageFilePathGuide", state: this.createBaseState(" - Image Setup", "setup", 2, this.itemIds.filePath)},
				{ key: "OpacityGuide" }
			]);
		}
	}

	private setupAsSlide(): () => Promise<void> {
		return async () => {
			const state = this.createBaseState(" - Slide Setup", "setupAsSlide", 5, this.itemIds.slideFilePaths);

			this.setNextSteps([
				{ key: "SlideFilePathsGuide",  state: Object.assign(state, Slide.getDefaultState(this.itemIds.slideFilePaths)) },
				{ key: "OpacityGuide" },
				{ key: "BaseQuickPickGuide",   state: Slide.getDefaultState(this.itemIds.slideIntervalUnit) },
				{ key: "SlideIntervalGuide",   state: Slide.getDefaultState(this.itemIds.slideInterval) },
				{ key: "SlideRandomPlayGuide", state: Slide.getDefaultState(this.itemIds.slideRandomPlay) }
			]);
		}
	}

	private uninstall(): () => Promise<void> {
		return async () => {
			this.state.placeholder = "Do you want to uninstall the wallpaper and erase all settings related to this extension?";
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title },
				args:  [
					{ yes: "Uninstall.", no: "Back to previous." },
					( async () => { this.installer.uninstall(); this.state.reload = true; await this.settings.uninstall(); await this.sync.uninstall(); } )
				]
			}]);
		}
	}
}
