import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { BaseQuickPickGuide }        from "./base/pick";
import { State }                     from "./base/base";
import { ExtensionContext }          from "vscode";
import { VSCodePreset }              from "../utils/base/vscodePreset";
import * as Wallpaper                from "./select/wallpaper";
import * as Slide                    from "./slide";

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

export class StartMenuGuide extends BaseQuickPickGuide {
	constructor(
		state:   State,
		context: ExtensionContext
	) {
		state.placeholder = "Select the item you want to do.";

		super(state, context);

		this.items        = new Array()
								.concat(!this.installer.isInstall && this.installer.isReady ? [items.Set]                : [])
								.concat(this.installer.isInstall                            ? [items.Reset, items.Crear] : [])
								.concat(this.installer.isReady                              ? [items.Setting]            : [])
								.concat(this.settings.isRegisterd                           ? [items.Favorite]           : [])
								.concat([items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit]);
	}

	public async show(input: MultiStepInput): Promise<void |  InputStep> {
		await super.show(input);

		let state: Partial<State>;

		switch (this.activeItem) {
			case items.Set:
			case items.Reset:
				Wallpaper.delegation2Transition(this, this.installer, this.settings, this.state, true);
				break;
			case items.Crear:
				this.selectClear();
				break;
			case items.Setting:
				this.setNextSteps([{ key: "SelectParameterType",   state: this.createState(" - Individual Settings", "setting", 0) }]);
				break;
			case items.Favorite:
				this.setNextSteps([{ key: "SelectFavoriteProcess", state: this.createState(" - Favorite Settings", "favorite", 0) }]);
				break;
			case items.Setup:
				state = this.createState(" - Image Setup", "setup", 2, this.settingItemId.filePath);
				this.setNextSteps([{ key: "ImageFilePathGuide", state: state }, { key: "OpacityGuide" }]);
				break;
			case items.SetUpAsSlide:
				state = this.createState(" - Slide Setup", "setupAsSlide", 5, this.settingItemId.slideFilePaths);
				this.setNextSteps([
					{ key: "SlideFilePathsGuide",  state: Object.assign(state, Slide.getDefaultState(this.settingItemId.slideFilePaths)) },
					{ key: "OpacityGuide" },
					{ key: "BaseQuickPickGuide",   state: Slide.getDefaultState(this.settingItemId.slideIntervalUnit) },
					{ key: "SlideIntervalGuide",   state: Slide.getDefaultState(this.settingItemId.slideInterval) },
					{ key: "SlideRandomPlayGuide", state: Slide.getDefaultState(this.settingItemId.slideRandomPlay) }
				]);
				break;
			case items.Uninstall:
				this.selectClear();
				await this.settings.uninstall();
				break;
			default:
				break;
		};
	}

	public async after(): Promise<void> {}

	private selectClear(): void {
		this.installer.uninstall();
		this.state.reload = true;
	}
}
