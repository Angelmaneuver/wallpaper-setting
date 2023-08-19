import * as assert                         from "assert";
import * as sinon                          from "sinon";
import * as path                           from "path";
import * as testTarget                     from "../../../../includes/guide/begin";
import { QuickPickItem, ExtensionContext } from "vscode";
import { MultiStepInput }                  from "../../../../includes/utils/multiStepInput";
import { State }                           from "../../../../includes/guide/base/base";
import { ExtensionSetting }                from "../../../../includes/settings/extension";
import { SettingSync }                     from "../../../../includes/settings/sync";
import { VSCodePreset }                    from "../../../../includes/utils/base/vscodePreset"
import { MainWallpaper }                   from "../../../../includes/wallpaper/main";
import * as WallpaperSelecter              from "../../../../includes/guide/select/wallpaper";
import { SelectParameterType }             from "../../../../includes/guide/select/parameter";
import { SelectFavoriteProcess }           from "../../../../includes/guide/select/favorite";
import { ImageFilePathGuide }              from "../../../../includes/guide/image";
import { SlideFilePathsGuide }             from "../../../../includes/guide/slide";
import { SelectSyncProcess }               from "../../../../includes/guide/select/sync";
import {
	messages,
	quickpicks,
	confirmItemType,
	confirmItem,
}                                          from "../../../../includes/constant";

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
	const confirm     = confirmItem(confirmItemType.confirm, { item1: messages.placeholder.uninstall.confirm.yes, item2: messages.placeholder.uninstall.confirm.no });
	const items       = {
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
		Yes:             confirm[0],
		No:              confirm[1],
	};

	test('constructor', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype,   "showQuickPick");
		const isInstallStub           = sinon.stub(MainWallpaper.prototype,    "isInstall");
		const isReadyStub             = sinon.stub(MainWallpaper.prototype,    "isReady");
		const isFavoriteRegisterdStub = sinon.stub(ExtensionSetting.prototype, "isFavoriteRegisterd");
		let   state                   = { title: "Test Suite", resultSet: {} } as State;
		const setting                 = new ExtensionSetting();
		let   instance                = new testTarget.StartMenuGuide(state);

		isInstallStub.get(() => false);
		isReadyStub.get(() => undefined);
		isFavoriteRegisterdStub.get(() => undefined);
		instance.init(); await MultiStepInput.run((input: MultiStepInput) => instance.show(input));

		await setting.set(ExtensionSetting.propertyIds.enableSync, true);
		isInstallStub.get(() => false);
		isReadyStub.get(() => undefined);
		isFavoriteRegisterdStub.get(() => undefined);
		state    = { title: "Test Suite", resultSet: {} } as State;
		instance = new testTarget.StartMenuGuide(state);
		instance.init(); await MultiStepInput.run((input: MultiStepInput) => instance.show(input));
		await setting.set(ExtensionSetting.propertyIds.enableSync, false);
		state    = { title: "Test Suite", resultSet: {} } as State;
		instance = new testTarget.StartMenuGuide(state);

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
			[items.Setup, items.SetUpAsSlide, items.Sync, items.Uninstall, items.Exit],
			pickStub.getCall(1).args[0].items
		);
		itemchecker(
			[items.Set, items.Setting, items.Favorite, items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(2).args[0].items
		);
		itemchecker(
			[items.Reset, items.Crear, items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(3).args[0].items
		);
		itemchecker(
			[items.Setup, items.SetUpAsSlide, items.Uninstall, items.Exit],
			pickStub.getCall(4).args[0].items
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
		const sync                  = sinon.createStubInstance(SettingSync);
		const syncUninstallStub     = sinon.stub(SettingSync.prototype,           "uninstall");
		const wallpaperStub         = sinon.stub(MainWallpaper.prototype,         "uninstall");
		const selectParameterStub   = sinon.stub(SelectParameterType.prototype,   "start");
		const selectFavoriteStub    = sinon.stub(SelectFavoriteProcess.prototype, "start");
		const imageStub             = sinon.stub(ImageFilePathGuide.prototype,    "start");
		const slideStub             = sinon.stub(SlideFilePathsGuide.prototype,   "start");
		const settingStub           = sinon.stub(ExtensionSetting.prototype,      "uninstall");
		const syncStartStub         = sinon.stub(SelectSyncProcess.prototype,     "start");
		const syncInitStub          = sinon.stub(SelectSyncProcess.prototype,     "init");
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

		pickStub.resolves(items.Sync);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.reset();
		pickStub.onCall(0).resolves(items.Uninstall)
				.onCall(1).resolves(items.No)
				.onCall(2).resolves(items.Exit);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.reset();
		pickStub.onCall(0).resolves(items.Uninstall)
				.onCall(1).resolves(items.Yes)
		state["sync"] = sync;
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		pickStub.reset();
		pickStub.resolves(items.Exit);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		assert.strictEqual(wallpaperSelecterStub.calledTwice, true);
		assert.strictEqual(wallpaperStub.calledTwice,         true);
		assert.strictEqual(selectParameterStub.calledOnce,    true);
		assert.strictEqual(selectFavoriteStub.calledOnce,     true);
		assert.strictEqual(imageStub.calledOnce,              true);
		assert.strictEqual(slideStub.calledOnce,              true);
		assert.strictEqual(settingStub.calledOnce,            true);
		assert.strictEqual(syncStartStub.calledOnce,          true);

		pickStub.restore();
		syncUninstallStub.restore();
		wallpaperStub.restore();
		selectParameterStub.restore();
		selectFavoriteStub.restore();
		imageStub.restore();
		slideStub.restore();
		settingStub.restore();
		syncInitStub.restore();
		syncStartStub.restore();
		wallpaperSelecterStub.restore();
	});
});
