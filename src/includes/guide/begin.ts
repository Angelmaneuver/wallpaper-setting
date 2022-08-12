import { Guide }                        from "./base/abc";
import { AbstractQuickPickSelectGuide } from "./base/pick";
import { ExtensionSetting }             from "../settings/extension";
import { WorkbenchSetting }             from "../settings/workbench";
import { VSCodePreset }                 from "../utils/base/vscodePreset";
import * as Wallpaper                   from "./select/wallpaper";
import * as Slide                       from "./slide";

const items = {
	Set:          VSCodePreset.create(VSCodePreset.Icons.debugStart,      "Set",         "Set wallpaper with current settings."),
	Reset:        VSCodePreset.create(VSCodePreset.Icons.debugRerun,      "Reset",       "Reset wallpaper with current settings."),
	Crear:        VSCodePreset.create(VSCodePreset.Icons.debugStop,       "Clear",       "Erase the wallpaper."),
	Setting:      VSCodePreset.create(VSCodePreset.Icons.settingsGear,    "Setting",     "Set Parameters individually."),
	Favorite:     VSCodePreset.create(VSCodePreset.Icons.repo,            "Favorite",    "Configure settings related to favorites."),
	Setup:        VSCodePreset.create(VSCodePreset.Icons.fileMedia,       "Setup Image", "Set an image to wallpaper."),
	SetUpAsSlide: VSCodePreset.create(VSCodePreset.Icons.folder,          "Setup Slide", "Set an image slide to wallpaper."),
	Optimize:     VSCodePreset.create(VSCodePreset.Icons.desktopDownload, "Optimize",    "Optimize the color theme you are using."),
	Sync:         VSCodePreset.create(VSCodePreset.Icons.sync,            "Sync",        "Configure settings related to Sync."),
	Uninstall:    VSCodePreset.create(VSCodePreset.Icons.trashcan,        "Uninstall",   "Remove all parameters for this extension."),
	Exit:         VSCodePreset.create(VSCodePreset.Icons.signOut,         "Exit",        "Exit without saving any changes."),
};

export class StartMenuGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.setItems();

		this.placeholder = "Select the item you want to do.";
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.Set.label:
			case items.Reset.label:
				return async () => { Wallpaper.delegation2Transition(this, this.state, true); };
			case items.Crear.label:
				return async () => { this.installer.uninstall(); this.state.reload = true; };
			case items.Setting.label:
				return async () => { this.setNextSteps([this.getGuideParameter("SelectParameterType",   " - Individual Settings", "setting",  0)]); };
			case items.Favorite.label:
				return async () => { this.setNextSteps([this.getGuideParameter("SelectFavoriteProcess", " - Favorite Settings",   "favorite", 0)]); };
			case items.Setup.label:
				return this.setup();
			case items.SetUpAsSlide.label:
				return this.setupAsSlide();
			case items.Optimize.label:
				return this.optimize();
			case items.Sync.label:
				return async () => { this.setNextSteps([this.getGuideParameter("SelectSyncProcess",     " - Sync",                "sync",     0)]); };
			case items.Uninstall.label:
				return this.uninstall();
			default:
				return undefined;
		}
	}

	private setup(): () => Promise<void> {
		return async () => {
			const nexts: Array<Guide> = [
				{ key: "ImageFilePathGuide", state: this.createBaseState(" - Image Setup", "setup", this.settings.isAdvancedMode ? 1 : 2, this.itemIds.filePath)},
			];

			if (!this.settings.isAdvancedMode) {
				nexts.push({ key: "OpacityGuide" });
			}

			nexts.push({ key: "SetupImageGuideEnd" });

			this.setNextSteps(nexts);
		}
	}

	private setupAsSlide(): () => Promise<void> {
		return async () => {
			const state               = this.createBaseState(" - Slide Setup", "setupAsSlide", this.settings.isAdvancedMode ? 4 : 5, this.itemIds.slideFilePaths);
			let   nexts: Array<Guide> = [
				{ key: "SlideFilePathsGuide",  state: Object.assign(state, Slide.getDefaultState(this.itemIds.slideFilePaths)) },
			];

			if (!this.settings.isAdvancedMode) {
				nexts.push({ key: "OpacityGuide" });
			}

			nexts = nexts.concat([
				{ key: "BaseQuickPickGuide",   state: Slide.getDefaultState(this.itemIds.slideIntervalUnit) },
				{ key: "SlideIntervalGuide",   state: Slide.getDefaultState(this.itemIds.slideInterval) },
				{ key: "SlideRandomPlayGuide", state: Slide.getDefaultState(this.itemIds.slideRandomPlay) },
			]);

			this.setNextSteps(nexts);
		}
	}

	private optimize(): () => Promise<void> {
		return async () => {
			const workbench = new WorkbenchSetting();

			this.state.initailValue = workbench.colorTheme;
			this.state.prompt       = "Please enter the name of the color theme you are using.";
			this.setNextSteps([
				{ key: "BaseInputGuide",        state: this.createBaseState(" - Color Optimize", "optimize", 5, "name") },
				{ key: "OpacityGuide",          state: { itemId: "basic",     prompt: "Please enter the opacity. * Used in basic areas." } },
				{ key: "OpacityGuide",          state: { itemId: "overlap",   prompt: "Please enter the high opacity. * Used in overlap areas." } },
				{ key: "OpacityGuide",          state: { itemId: "selection", prompt: "Please enter the low opacity. * Used in selection areas." } },
				{ key: "InputJsonFilePathGuide" },
			])
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

	private setItems(): void {
		const set       = !this.installer.isInstall && this.installer.isReady ? [items.Set]                     : [];
		const installed = this.installer.isInstall                            ? [items.Reset, items.Crear]      : [];
		const ready     = this.installer.isReady                              ? [items.Setting, items.Favorite] : [];
		const optimize  = this.settings.isAdvancedMode                        ? [items.Optimize]                : [];
		const sync      = this.settings.isSyncMode                            ? [items.Sync]                    : [];

		this.items      = this.items.concat(set, installed, ready, [items.Setup, items.SetUpAsSlide], optimize, sync, [items.Uninstall, items.Exit]);
	}

	private getGuideParameter(
		key:             string,
		additionalTitle: string,
		guideGroupId:    string,
		totalStep?:      number,
		itemId?:         string
	): Guide {
		return {
			key:   key,
			state: this.createBaseState(additionalTitle, guideGroupId, totalStep, itemId)
		}
	}
}
