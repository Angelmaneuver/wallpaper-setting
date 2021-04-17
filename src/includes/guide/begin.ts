import { ExtensionContext }          from "vscode";
import { VSCodePreset }              from "../utils/base/vscodePreset";
import { Constant }                  from "../constant";
import { State }                     from "./base/base";
import { BaseQuickPickGuide }        from "./base/pick";
import { InputStep, MultiStepInput } from "../utils/multiStepInput";
import { GuideFactory }              from "./factory/base";

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
	private autoSet: undefined | number;
	private random:  boolean;

	constructor(
		state:   State,
		context: ExtensionContext
	) {

		state.placeholder = "Select the item you want to do.";

		super(state, context);

		const installed   = this.installer.isInstall();
		const ready       = this.installer.isReady();
		this.items        = new Array()
								.concat(!installed && ready               ? [items.Set]                : [])
								.concat(installed                         ? [items.Reset, items.Crear] : [])
								.concat(ready                             ? [items.Setting]            : [])
								.concat(!(!this.settings.isFavoriteExist) ? [items.Favorite]           : [])
								.concat([items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit]);
		this.autoSet      = undefined;
		this.random       = this.settings.favoriteRandomSet;

		if (!(typeof(ready) === "boolean")) {
			if (ready.image && !ready.slide) {
				this.autoSet = Constant.WallpaperType.Image;
			} else if (!ready.image && ready.slide) {
				this.autoSet = Constant.WallpaperType.Slide;
			}
		}
	}

	public async show(input: MultiStepInput): Promise<void |  InputStep> {
		this.nextStep         = undefined;

		await super.show(input);

		this.state.step       = 0;
		this.state.totalSteps = 0;

		switch (this.activeItem) {
			case items.Set:
			case items.Reset:
				this.selectSetWallpaper();
				break;
			case items.Crear:
				this.selectClear();
				break;
			case items.Setting:
				this.selectSetting();
				break;
			case items.Favorite:
				this.selectFavorite();
				break;
			case items.Setup:
				this.selectSetup();
				break;
			case items.SetUpAsSlide:
				this.selectSetupAsSlide();
				break;
			case items.Uninstall:
				this.selectUninstall();
				break;
			default:
				break;
		};
	}

	private selectSetWallpaper(): void {
		if (this.autoSet === undefined) {
			if (this.random) {
				this.state.reload = true;
			} else {
				this.state.title = this.title + " - Select Setup Type";
				this.setNextStep(GuideFactory.create("SelectSetupType", this.state));
			}
		} else {
			switch (this.autoSet) {
				case Constant.WallpaperType.Image:
					this.installer.install();
					break;
				case Constant.WallpaperType.Slide:
					this.installer.installAsSlide();
					break;
				default:
					break;
			}

			this.state.reload = true;
		}
	}

	private selectClear(): void {
		this.installer.uninstall();
		this.state.reload = true;
	}

	private selectSetting(): void {
		this.state.title        = this.title + " - Individual Settings";
		this.state.guideGroupId = "setting";
		this.setNextStep(GuideFactory.create("SelectParameterType", this.state));
	}

	private selectFavorite(): void {
		this.state.title        = this.title + " - Favorite Settings";
		this.state.guideGroupId = "favorite";
		this.setNextStep(GuideFactory.create("SelectFavoriteProcess", this.state));
	}

	private selectSetup(): void {
		this.state.title        = this.title + " - Image Setup";
		this.state.guideGroupId = "setup";
		this.state.totalSteps   = 2;
		this.setNextStep(GuideFactory.create("ImageFilePathGuide", this.state))
			.setNextStep(GuideFactory.create("OpacityGuide",       this.state));
	}

	private selectSetupAsSlide(): void {
		this.state.title        = this.title + " - Slide Setup";
		this.state.guideGroupId = "setupAsSlide";
		this.state.totalSteps   = 5;
		this.setNextStep(GuideFactory.create("SlideFilePathsGuide",    this.state))
			.setNextStep(GuideFactory.create("OpacityGuide",           this.state))
			.setNextStep(GuideFactory.create("SlideIntervalUnitGuide", this.state))
			.setNextStep(GuideFactory.create("SlideIntervalGuide",     this.state))
			.setNextStep(GuideFactory.create("SlideRandomPlayGuide",   this.state));
	}

	private async selectUninstall(): Promise<void> {
		this.selectClear();
		await this.settings.uninstall();
	}
}
