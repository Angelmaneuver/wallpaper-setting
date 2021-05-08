import * as assert                         from "assert";
import * as sinon                          from "sinon";
import * as path                           from "path";
import * as testTarget                     from "../../../../includes/guide/begin";
import { QuickPickItem, ExtensionContext } from "vscode";
import { MultiStepInput }                  from "../../../../includes/utils/multiStepInput";
import { State }                           from "../../../../includes/guide/base/base";
import { ExtensionSetting }                from "../../../../includes/settings/extension";
import { VSCodePreset }                    from "../../../../includes/utils/base/vscodePreset"
import { Wallpaper }                       from "../../../../includes/wallpaper";
import * as WallpaperSelecter              from "../../../../includes/guide/select/wallpaper";
import { SelectParameterType }             from "../../../../includes/guide/select/parameter";
import { SelectFavoriteProcess }           from "../../../../includes/guide/select/favorite";
import { ImageFilePathGuide }              from "../../../../includes/guide/image";
import { SlideFilePathsGuide }             from "../../../../includes/guide/slide";

suite('Guide - Begin Test Suite', async () => {
	const itemchecker = (assumption: Array<QuickPickItem>, result: Array<QuickPickItem>) => {
		if (assumption.length !== result.length) {
			assert.fail(`assumption:${assumption.length} !== result:${result.length}`);
		}

		assumption.forEach((assumptionItem) => {
			const check = result.find((resultItem) => {
				return assumptionItem.label === resultItem.label && assumptionItem.description === resultItem.description
			});

			if (!check) {
				assert.fail(`${assumptionItem.label} is not found...`);
			}
		});
	};
	const items       = {
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

	test('constructor', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const isInstallStub           = sinon.stub(Wallpaper.prototype, "isInstall");
		const isReadyStub             = sinon.stub(Wallpaper.prototype, "isReady");
		const isFavoriteRegisterdStub = sinon.stub(ExtensionSetting.prototype, "isFavoriteRegisterd");
		const state                   = { title: "Test Suite", resultSet: {} } as State;
		const instance                = new testTarget.StartMenuGuide(state);

		isInstallStub.get(() => false);
		isReadyStub.get(() => undefined);
		isFavoriteRegisterdStub.get(() => undefined);
		instance.init(); await MultiStepInput.run((input: MultiStepInput) => instance.show(input));

		isInstallStub.get(() => false);
		isReadyStub.get(() => { return { image: true, slide: true }});
		instance.init(); await MultiStepInput.run((input: MultiStepInput) => instance.show(input));

		isInstallStub.get(() => true);
		isReadyStub.get(() => undefined);
		instance.init(); await MultiStepInput.run((input: MultiStepInput) => instance.show(input));

		isInstallStub.get(() => false);
		isReadyStub.get(() => undefined);
		instance.init(); await MultiStepInput.run((input: MultiStepInput) => instance.show(input));

		itemchecker(
			[items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(0).args[0].items
		);
		itemchecker(
			[items.Set, items.Setting, items.Favorite, items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(1).args[0].items
		);
		itemchecker(
			[items.Reset, items.Crear, items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(2).args[0].items
		);
		itemchecker(
			[items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(3).args[0].items
		);

		pickStub.restore();
		isInstallStub.restore();
		isReadyStub.restore();
		isFavoriteRegisterdStub.restore();
	});

	test('getExecute', async () => {
		const stateCreater          = () => ({ title: "Test Suite", resultSet: {} } as State);
		const pickStub              = sinon.stub(MultiStepInput.prototype,        "showQuickPick");
		const wallpaperSelecterStub = sinon.stub(WallpaperSelecter,               "delegation2Transition");
		const wallpaperStub         = sinon.stub(Wallpaper.prototype,             "uninstall");
		const selectParameterStub   = sinon.stub(SelectParameterType.prototype,   "start");
		const selectFavoriteStub    = sinon.stub(SelectFavoriteProcess.prototype, "start");
		const imageStub             = sinon.stub(ImageFilePathGuide.prototype,    "start");
		const slideStub             = sinon.stub(SlideFilePathsGuide.prototype,   "start");
		const settingStub           = sinon.stub(ExtensionSetting.prototype,      "uninstall");
		const context               = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;
		let   state                 = stateCreater();

		pickStub.resolves(items.Set);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.Reset);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.Crear);
		state = stateCreater();
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));
		assert.strictEqual(state.reload, true);

		pickStub.resolves(items.Setting);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.Favorite);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.Setup);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.SetUpAsSlide);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.Uninstall);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.resolves(items.Exit);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		assert.strictEqual(wallpaperSelecterStub.calledTwice, true);
		assert.strictEqual(wallpaperStub.calledTwice,         true);
		assert.strictEqual(selectParameterStub.calledOnce,    true);
		assert.strictEqual(selectFavoriteStub.calledOnce,     true);
		assert.strictEqual(imageStub.calledOnce,              true);
		assert.strictEqual(slideStub.calledOnce,              true);
		assert.strictEqual(settingStub.calledOnce,            true);

		pickStub.restore();
		wallpaperStub.restore();
		selectParameterStub.restore();
		selectFavoriteStub.restore();
		imageStub.restore();
		slideStub.restore();
		settingStub.restore();
		wallpaperSelecterStub.restore();
	});
});
