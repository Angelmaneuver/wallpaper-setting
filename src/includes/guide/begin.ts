import { Guide }                         from "./base/abc";
import { State }                         from "./base/base";
import { AbstractQuickPickSelectGuide }  from "./base/pick";
import { BaseValidator }                 from "./validator/base";
import { WorkbenchSetting }              from "../settings/workbench";
import { VSCodePreset }                  from "../utils/base/vscodePreset";
import * as Wallpaper                    from "./select/wallpaper";
import * as Slide                        from "./slide";
import { messages, words, quickpicks }   from "../constant";

const items = {
	Set:             VSCodePreset.create(VSCodePreset.Icons.debugStart,      ...quickpicks.begin.set),
	Reset:           VSCodePreset.create(VSCodePreset.Icons.debugRerun,      ...quickpicks.begin.reset),
	Crear:           VSCodePreset.create(VSCodePreset.Icons.debugStop,       ...quickpicks.begin.clear),
	Setting:         VSCodePreset.create(VSCodePreset.Icons.settingsGear,    ...quickpicks.begin.setting),
	Favorite:        VSCodePreset.create(VSCodePreset.Icons.repo,            ...quickpicks.begin.favorite),
	Setup:           VSCodePreset.create(VSCodePreset.Icons.fileMedia,       ...quickpicks.begin.setup),
	SetUpAsSlide:    VSCodePreset.create(VSCodePreset.Icons.folder,          ...quickpicks.begin.setUpAsSlide),
	Optimize:        VSCodePreset.create(VSCodePreset.Icons.desktopDownload, ...quickpicks.begin.optimize),
	ProcessExplorer: VSCodePreset.create(VSCodePreset.Icons.window,          ...quickpicks.begin.processExplorer),
	Sync:            VSCodePreset.create(VSCodePreset.Icons.sync,            ...quickpicks.begin.sync),
	Uninstall:       VSCodePreset.create(VSCodePreset.Icons.trashcan,        ...quickpicks.begin.uninstall),
	Exit:            VSCodePreset.create(VSCodePreset.Icons.signOut,         ...quickpicks.begin.exit),
};

export class StartMenuGuide extends AbstractQuickPickSelectGuide {
	public init(): void {
		super.init();

		this.setItems();

		this.placeholder = messages.placeholder.begin;
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.Set.label:
			case items.Reset.label:
				return async () => { Wallpaper.delegation2Transition(this, this.state, true); };
			case items.Crear.label:
				return async () => { this.installer.uninstall(); this.state.reload = true; };
			case items.Setting.label:
				return async () => { this.setNextSteps([this.getGuideParameter("SelectParameterType",   words.headline.setting,     "setting",  0)]); };
			case items.Favorite.label:
				return async () => { this.setNextSteps([this.getGuideParameter("SelectFavoriteProcess", words.headline.favorite,    "favorite", 0)]); };
			case items.Setup.label:
				return this.setup();
			case items.SetUpAsSlide.label:
				return this.setupAsSlide();
			case items.Optimize.label:
				return this.optimize();
			case items.ProcessExplorer.label:
				return this.processExplorer();
			case items.Sync.label:
				return async () => { this.setNextSteps([this.getGuideParameter("SelectSyncProcess",     words.headline.sync.select, "sync",     0)]); };
			case items.Uninstall.label:
				return this.uninstall();
			default:
				return undefined;
		}
	}

	private setup(): () => Promise<void> {
		return async () => {
			const nexts: Array<Guide> = [
				{ key: "ImageFilePathGuide", state: this.createBaseState(words.headline.setup, "setup", this.settings.isAdvancedMode ? 1 : 2, this.itemIds.filePath)},
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
			const state               = this.createBaseState(words.headline.setupAsSlide, "setupAsSlide", this.settings.isAdvancedMode ? 4 : 5, this.itemIds.slideFilePaths);
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
			this.state.prompt       = messages.placeholder.optimize.theme;
			this.setNextSteps([
				{ key: "BaseInputGuide",        state: this.createBaseState(words.headline.optimize, "optimize", 5, "name") },
				{ key: "OpacityGuide",          state: { itemId: "basic",     prompt: messages.placeholder.optimize.basic } },
				{ key: "OpacityGuide",          state: { itemId: "overlap",   prompt: messages.placeholder.optimize.overlap } },
				{ key: "OpacityGuide",          state: { itemId: "selection", prompt: messages.placeholder.optimize.selection } },
				{ key: "InputJsonFilePathGuide" },
			]);
		}
	}

	private processExplorer(): () => Promise<void> {
		if (this.state.installer.isAddedProcessExplorerBackgroundColor) {
			return this.processExplorerWithRemove();
		} else {
			return this.processExplorerWithAdd();
		}
	}

	private processExplorerWithAdd(): () => Promise<void> {
		return async() => {
			const workbench = new WorkbenchSetting();

			if (
				0                           <  workbench.colorTheme.length                                &&
				`[${workbench.colorTheme}]` in workbench.colorCustomizations                              &&
				'editor.background'         in workbench.colorCustomizations[`[${workbench.colorTheme}]`]
			) {
				const colorCode         = workbench.colorCustomizations[`[${workbench.colorTheme}]`]['editor.background'];

				this.state.initailValue = 2 < colorCode.length ? colorCode.substring(0, colorCode.length - 2) : '';
			}

			this.state.prompt = messages.placeholder.processExplorer.add.colorCode;
			this.setNextSteps([
				{
					key:   "BaseInputGuide",
					state: { ...this.createBaseState(words.headline.processExplorer, "processExplorer", 2, "colorCode"), validate:BaseValidator.validateHexColorCode }
				},
				{
					key:   "BaseConfirmGuide",
					state: { placeholder: messages.placeholder.processExplorer.add.confirm.message } as State,
					args:  [
						{ yes: messages.placeholder.processExplorer.add.confirm.yes, no: messages.placeholder.processExplorer.add.confirm.no },
						( async () => {
							const guideGroupId = this.state.guideGroupId as string;
							const colorCode    = (this.state.resultSet[guideGroupId] as Record<string, unknown>)['colorCode'] as string;

							this.state.installer.addProcessExplorerBackgroundColor(colorCode);
							this.state.message = messages.showInformationMessage.processExplorer.add;
						} )
					]
				},
			]);
		}
	}

	private processExplorerWithRemove(): () => Promise<void> {
		return async () => {
			this.state.placeholder = messages.placeholder.processExplorer.remove.confirm.message;
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				args:  [
					{ yes: messages.placeholder.processExplorer.remove.confirm.yes, no: messages.placeholder.processExplorer.remove.confirm.no },
					( async () => {
						this.state.installer.removeProcessExplorerBackgroundColor();
						this.state.message = messages.showInformationMessage.processExplorer.remove;
					} )
				]
			}]);
		};
	}

	private uninstall(): () => Promise<void> {
		return async () => {
			this.state.placeholder = messages.placeholder.uninstall.confirm.message;
			this.setNextSteps([{
				key:   "BaseConfirmGuide",
				state: { title: this.title },
				args:  [
					{ yes: messages.placeholder.uninstall.confirm.yes, no: messages.placeholder.uninstall.confirm.no },
					( async () => { this.installer.uninstall(); this.installer.removeProcessExplorerBackgroundColor(); this.state.reload = true; await this.settings.uninstall(); await this.sync.uninstall(); } )
				]
			}]);
		}
	}

	private setItems(): void {
		const set       = !this.installer.isInstall && this.installer.isReady ? [items.Set]                             : [];
		const installed = this.installer.isInstall                            ? [items.Reset, items.Crear]              : [];
		const ready     = this.installer.isReady                              ? [items.Setting, items.Favorite]         : [];
		const optimize  = this.settings.isAdvancedMode                        ? [items.Optimize, items.ProcessExplorer] : [];
		const sync      = this.settings.isSyncMode                            ? [items.Sync]                            : [];

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
