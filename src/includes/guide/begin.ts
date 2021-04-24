import { AbstractQuickPickGuide } from "./base/pick";
import { State }                  from "./base/base";
import { VSCodePreset }           from "../utils/base/vscodePreset";
import * as Wallpaper             from "./select/wallpaper";
import * as Slide                 from "./slide";

const items = {
	Set:          VSCodePreset.create(VSCodePreset.Icons.debugStart,   "Set",         "Set wallpaper with current settings."),
	Reset:        VSCodePreset.create(VSCodePreset.Icons.debugRerun,   "Reset",       "Reset wallpaper with current settings."),
	Crear:        VSCodePreset.create(VSCodePreset.Icons.debugStop,    "Clear",       "Erase the wallpaper."),
	Setting:      VSCodePreset.create(VSCodePreset.Icons.settingsGear, "Setting",     "Set Parameters individually."),
	Favorite:     VSCodePreset.create(VSCodePreset.Icons.repo,         "Favorite",    "Configure settings related to favorites."),
	Setup:        VSCodePreset.create(VSCodePreset.Icons.fileMedia,    "Setup Image", "Set an image to wallpaper."),
	SetUpAsSlide: VSCodePreset.create(VSCodePreset.Icons.folder,       "Setup Slide", "Set an image slide to wallpaper."),
	Uninstall:    VSCodePreset.create(VSCodePreset.Icons.trashcan,     "Uninstall",   "Remove all parameters for this extension."),
	Exit:         VSCodePreset.create(VSCodePreset.Icons.signOut,      "Exit",        "Exit without saving any changes."),
};

export class StartMenuGuide extends AbstractQuickPickGuide {
	public init(): void {
		super.init();

		this.placeholder   = "Select the item you want to do.";
		this.items         =
			this.items
			.concat(!this.installer.isInstall && this.installer.isReady ? [items.Set]                : [])
			.concat(this.installer.isInstall                            ? [items.Reset, items.Crear] : [])
			.concat(this.installer.isReady                              ? [items.Setting]            : [])
			.concat(this.settings.isRegisterd                           ? [items.Favorite]           : [])
			.concat([items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit]);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.Set.label:
			case items.Reset.label:
				return async () => { Wallpaper.delegation2Transition(this, this.state, true); };
			case items.Crear.label:
				return this.clear();
			case items.Setting.label:
				return async () => { this.setNextSteps([{ key: "SelectParameterType",   state: this.createBaseState(" - Individual Settings", "setting",  0) }]); };
			case items.Favorite.label:
				return async () => { this.setNextSteps([{ key: "SelectFavoriteProcess", state: this.createBaseState(" - Favorite Settings",   "favorite", 0) }]); };
			case items.Setup.label:
				return this.setup();
			case items.SetUpAsSlide.label:
				return this.setupAsSlide();
			case items.Uninstall.label:
				return async () => { this.clear(); await this.settings.uninstall(); }
			default:
				return undefined;
		}
	}

	private clear(): () => Promise<void> {
		return async () => {
			this.installer.uninstall();
			this.state.reload = true;	
		}
	}

	private setup(): () => Promise<void> {
		return async () => {
			this.setNextSteps([
				{ key: "ImageFilePathGuide", state: this.createBaseState(" - Image Setup", "setup", 2, this.settingItemId.filePath)},
				{ key: "OpacityGuide" }
			]);
		}
	}

	private setupAsSlide(): () => Promise<void> {
		return async () => {
			const state: Partial<State> = this.createBaseState(" - Slide Setup", "setupAsSlide", 5, this.settingItemId.slideFilePaths);

			this.setNextSteps([
				{ key: "SlideFilePathsGuide",  state: Object.assign(state, Slide.getDefaultState(this.settingItemId.slideFilePaths)) },
				{ key: "OpacityGuide" },
				{ key: "BaseQuickPickGuide",   state: Slide.getDefaultState(this.settingItemId.slideIntervalUnit) },
				{ key: "SlideIntervalGuide",   state: Slide.getDefaultState(this.settingItemId.slideInterval) },
				{ key: "SlideRandomPlayGuide", state: Slide.getDefaultState(this.settingItemId.slideRandomPlay) }
			]);
		}
	}
}
