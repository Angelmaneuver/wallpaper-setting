import * as assert          from "assert";
import * as sinon           from "sinon";
import * as path            from "path";
import * as fs              from "fs";
import * as testTarget      from "../../../includes/guide/begin";
import { ExtensionContext } from "vscode";
import { MultiStepInput }   from "../../../includes/utils/multiStepInput";
import { State }            from "../../../includes/guide/base/base";
import { ExtensionSetting } from "../../../includes/settings/extension";
import { VSCodePreset }     from "../../../includes/utils/base/vscodePreset";
import { File }             from "../../../includes/utils/base/file";
import * as Encrypt         from "../../../includes/utils/base/encrypt";
import { MainWallpaper }    from "../../../includes/wallpaper/main";
import { SettingSync }      from "../../../includes/settings/sync";
import { ContextManager }   from "../../../includes/utils/base/context";
import {
	quickpicks,
	confirmItem,
	confirmItemType,
}                           from "../../../includes/constant";

suite('Scenario - Sync Test Suite', async () => {
	const stateCreater = (sync: SettingSync) => ({ title: "Test Suite", resultSet: {}, sync: sync } as State);
	const password     = "password";
	const salt         = "salt";
	const items        = {
		Sync:            VSCodePreset.create(VSCodePreset.Icons.sync,            ...quickpicks.begin.sync),
		Uninstall:       VSCodePreset.create(VSCodePreset.Icons.trashcan,        ...quickpicks.begin.uninstall),
		Exit:            VSCodePreset.create(VSCodePreset.Icons.signOut,         ...quickpicks.begin.exit),
		Upload:          VSCodePreset.create(VSCodePreset.Icons.debugStepOut,    ...quickpicks.sync.upload),
		Download:        VSCodePreset.create(VSCodePreset.Icons.debugStepInto,   ...quickpicks.sync.download),
		Delete:          VSCodePreset.create(VSCodePreset.Icons.trashcan,        ...quickpicks.sync.delete),
		Return:          VSCodePreset.create(VSCodePreset.Icons.reply,           ...quickpicks.sync.return),
		Yes:             confirmItem(confirmItemType.confirm, { item1: "", item2: ""})[0],
		No:              confirmItem(confirmItemType.confirm, { item1: "", item2: ""})[1],
	};

	test('Begin -> Sync -> Upload -> Image -> Opacity -> Password -> Salt', async () => {
		const filePath        = path.join(__dirname, "testDir", "test.png");
		const opacity         = "0.55";
		const readData        = "Sync test data."
		const inputStub       = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const pickStub        = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const sync            = sinon.createStubInstance(SettingSync);
		const isAvailableStub = sinon.stub(SettingSync.prototype,    "isAvailable");
		const setDataStub     = sinon.stub(SettingSync.prototype,    "setData");
		const setOpacityStub  = sinon.stub(SettingSync.prototype,    "setOpacity");
		const isFileStub      = sinon.stub(File,                     "isFile");
		const getFileSizeStub = sinon.stub(File,                     "getFilesize");
		const fsReaderStub    = sinon.stub(fs,                       "readFileSync");
		const context         = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;

		pickStub.onFirstCall().resolves(items.Sync);
		pickStub.onSecondCall().resolves(items.Upload);
		inputStub.onFirstCall().resolves(filePath);
		inputStub.onSecondCall().resolves(opacity);
		inputStub.onThirdCall().resolves(password);
		inputStub.onCall(4).resolves(salt);
		isAvailableStub.value(false);
		isFileStub.returns(true);
		getFileSizeStub.returns(500 * 1024);
		fsReaderStub.returns(readData);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(stateCreater(sync), context).start(input));

		assert.strictEqual(inputStub.callCount, 4);
		assert.strictEqual(pickStub.callCount,  2);

		inputStub.restore();
		pickStub.restore();
		isAvailableStub.restore();
		setDataStub.restore();
		setOpacityStub.restore();
		fsReaderStub.restore();
	}).timeout(30 * 1000);

	test('Begin -> Sync -> Download -> Password -> Salt', async () => {
		const opacity         = "0.55";
		const readData        = "Sync test data."
		const inputStub       = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const pickStub        = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const sync            = sinon.createStubInstance(SettingSync);
		const isAvailableStub = sinon.stub(SettingSync.prototype,    "isAvailable");
		const getDataStub     = sinon.stub(SettingSync.prototype,    "getData");
		const getOpacityStub  = sinon.stub(SettingSync.prototype,    "getOpacity");
		const wallpaperStub   = sinon.stub(MainWallpaper.prototype,  "installFromSync");
		const decryptStub     = sinon.stub(Encrypt,                  "decrypt");
		const ctxStub         = sinon.stub(ContextManager, "version").value("9.9.9");
		const context         = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;
		const setting         = new ExtensionSetting();

		await setting.set(ExtensionSetting.propertyIds.enableSync, true);

		pickStub.onFirstCall().resolves(items.Sync);
		pickStub.onSecondCall().resolves(items.Download);
		inputStub.onFirstCall().resolves(password);
		inputStub.onSecondCall().resolves(salt);
		isAvailableStub.value(true);
		getDataStub.value(["iv", "data"]);
		getOpacityStub.value(opacity);
		decryptStub.returns(Buffer.from(`data:image/png;base64,${readData}`));

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(stateCreater(sync), context).start(input));

		assert.strictEqual(inputStub.callCount,      2);
		assert.strictEqual(pickStub.callCount,       2);
		assert.strictEqual(wallpaperStub.calledOnce, true);

		inputStub.restore();
		pickStub.restore();
		isAvailableStub.restore();
		getDataStub.restore();
		getOpacityStub.restore();
		wallpaperStub.restore();
		decryptStub.restore();
		ctxStub.restore();

		setting.uninstall();
	}).timeout(30 * 1000);

	test('Begin -> Sync -> Delete', async () => {
		const pickStub        = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const sync            = sinon.createStubInstance(SettingSync);
		const isAvailableStub = sinon.stub(SettingSync.prototype,    "isAvailable");
		const uninstallStub   = sinon.stub(SettingSync.prototype,    "uninstall");
		const context         = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;
		const state           = stateCreater(sync);
		const setting         = new ExtensionSetting();

		await setting.set(ExtensionSetting.propertyIds.enableSync, true);

		pickStub.onFirstCall().resolves(items.Sync);
		pickStub.onSecondCall().resolves(items.Delete);
		pickStub.onThirdCall().resolves(items.Yes);
		isAvailableStub.value(true);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		assert.strictEqual(pickStub.callCount, 3);
		assert.strictEqual(state.message,      `Removed wallpaper settings from Settings Sync.`);

		pickStub.restore();
		isAvailableStub.restore();
		uninstallStub.restore();

		setting.uninstall();
	}).timeout(30 * 1000);

	test('Begin -> Sync -> Return -> Exit', async () => {
		const pickStub        = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const sync            = sinon.createStubInstance(SettingSync);
		const isAvailableStub = sinon.stub(SettingSync.prototype,    "isAvailable");
		const context         = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;
		const state           = stateCreater(sync);
		const setting         = new ExtensionSetting();

		await setting.set(ExtensionSetting.propertyIds.enableSync, true);

		pickStub.onFirstCall().resolves(items.Sync);
		pickStub.onSecondCall().resolves(items.Return);
		pickStub.onThirdCall().resolves(items.Exit);
		isAvailableStub.value(false);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		assert.strictEqual(pickStub.callCount, 3);

		pickStub.restore();
		isAvailableStub.restore();

		setting.uninstall();
	}).timeout(30 * 1000);
});
