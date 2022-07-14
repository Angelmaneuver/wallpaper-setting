import * as assert            from "assert";
import * as sinon             from "sinon";
import * as path              from "path";
import * as testTarget        from "../../../includes/guide/begin";
import { ExtensionContext }   from "vscode";
import { MultiStepInput }     from "../../../includes/utils/multiStepInput";
import { State }              from "../../../includes/guide/base/base";
import { ExtensionSetting }   from "../../../includes/settings/extension";
import { Wallpaper }          from "../../../includes/wallpaper";
import * as Constant          from "../../../includes/constant";
import { VSCodePreset }       from "../../../includes/utils/base/vscodePreset";
import { File }               from "../../../includes/utils/base/file";

suite('Scenario - Setup Slide Test Suite', async () => {
	const stateCreater  = () => ({ title: "Test Suite", resultSet: {} } as State);
	const items         = {
		SetUpAsSlide: VSCodePreset.create(VSCodePreset.Icons.folder,       "Setup Slide", "Set an image slide to wallpaper."),
	};

	test('Begin -> Slide -> Opacity -> IntervalUnit -> Interval -> RandomPlay', async () => {
		const directoryPath = path.join(__dirname, "testDir1");
		const filePaths     = [path.join(__dirname, "testDir1", "test1.png"), path.join(__dirname, "testDir1", "testDir2", "test2.gif")];
		const opacity       = "0.95";
		const intervalUnit  = Constant.slideIntervalUnit[2];
		const prompt        = `Enter a number between ${Constant.minimumSlideInterval} and 65555 in Second. (Default: 25)`;
		const interval      = "60";
		const randomPlay    = Constant.slideRandomPlay[0];
		const inputStub     = sinon.stub(MultiStepInput.prototype,        "showInputBox");
		const pickStub      = sinon.stub(MultiStepInput.prototype,        "showQuickPick");
		const fileStub      = sinon.stub(File,                            "getChildrens");
		const fileCheckStub = sinon.stub(File,                            "isFile");
		const dirCheckStub  = sinon.stub(File,                            "isDirectory")
		const wallpaperStub = sinon.stub(Wallpaper.prototype,             "installAsSlide");
		const state         = stateCreater();
		const context       = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;

		pickStub.onFirstCall().resolves(items.SetUpAsSlide);
		inputStub.onFirstCall().resolves(directoryPath);
		inputStub.onSecondCall().resolves(opacity);
		pickStub.onSecondCall().resolves(intervalUnit);
		inputStub.onThirdCall().resolves(interval);
		pickStub.onThirdCall().resolves(randomPlay);
		fileCheckStub.onFirstCall().returns(false);
		dirCheckStub.onFirstCall().returns(true);
		fileStub.onFirstCall().returns(filePaths);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		assert.strictEqual(state.reload,                                                             true);
		assert.strictEqual(inputStub.getCall(2).args[0].prompt,                                      prompt);

		const setting       = new ExtensionSetting();

		const result        = setting.getItemValue(ExtensionSetting.propertyIds.slideFilePaths) as Array<string>;
		if (filePaths.length !== result.length) {
			assert.fail(`assumption:${filePaths.length} !== result:${result.length}`);
		}
		filePaths.forEach((file) => {
			const check = result.find((resultItem) => {
				return file === resultItem
			});

			if (!check) {
				assert.fail(`${file} is not found...`);
			}
		});
		assert.strictEqual(setting.getItemValue(ExtensionSetting.propertyIds.opacity),               Number(opacity));
		assert.strictEqual(setting.getItemValue(ExtensionSetting.propertyIds.slideIntervalUnit),     "Second");
		assert.strictEqual(setting.getItemValue(ExtensionSetting.propertyIds.slideInterval),         Number(interval))
		assert.strictEqual(setting.getItem(ExtensionSetting.propertyIds.slideRandomPlay).validValue, true);
		assert.strictEqual(pickStub.calledThrice,                                                    true);
		assert.strictEqual(inputStub.calledThrice,                                                   true);
		assert.strictEqual(fileCheckStub.calledOnce,                                                 true);
		assert.strictEqual(dirCheckStub.calledOnce,                                                  true);
		assert.strictEqual(fileStub.calledOnce,                                                      true);
		assert.strictEqual(wallpaperStub.calledOnce,                                                 true);

		inputStub.restore();
		pickStub.restore();
		fileCheckStub.restore();
		dirCheckStub.restore();
		fileStub.restore();
		wallpaperStub.restore();

		await setting.uninstall();
	}).timeout(30 * 1000);

	test('Begin -> Slide -> IntervalUnit -> Interval -> RandomPlay - Advanced Mode', async () => {
		const directoryPath = path.join(__dirname, "testDir1");
		const filePaths     = [path.join(__dirname, "testDir1", "test1.png"), path.join(__dirname, "testDir1", "testDir2", "test2.gif")];
		const opacity       = "0.75";
		const intervalUnit  = Constant.slideIntervalUnit[2];
		const prompt        = `Enter a number between ${Constant.minimumSlideInterval} and 65555 in Second. (Default: 25)`;
		const interval      = "60";
		const randomPlay    = Constant.slideRandomPlay[0];
		const inputStub     = sinon.stub(MultiStepInput.prototype,        "showInputBox");
		const pickStub      = sinon.stub(MultiStepInput.prototype,        "showQuickPick");
		const fileStub      = sinon.stub(File,                            "getChildrens");
		const fileCheckStub = sinon.stub(File,                            "isFile");
		const dirCheckStub  = sinon.stub(File,                            "isDirectory")
		const wallpaperStub = sinon.stub(Wallpaper.prototype,             "installAsSlide");
		const state         = stateCreater();
		const context       = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;

		await new ExtensionSetting().set(ExtensionSetting.propertyIds.advancedMode, true);

		pickStub.onFirstCall().resolves(items.SetUpAsSlide);
		inputStub.onFirstCall().resolves(directoryPath);
		pickStub.onSecondCall().resolves(intervalUnit);
		inputStub.onSecondCall().resolves(interval);
		pickStub.onThirdCall().resolves(randomPlay);
		fileCheckStub.onFirstCall().returns(false);
		dirCheckStub.onFirstCall().returns(true);
		fileStub.onFirstCall().returns(filePaths);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(state, context).start(input));

		assert.strictEqual(state.reload,                                                             true);
		assert.strictEqual(inputStub.getCall(1).args[0].prompt,                                      prompt);

		const setting       = new ExtensionSetting();

		const result        = setting.getItemValue(ExtensionSetting.propertyIds.slideFilePaths) as Array<string>;
		if (filePaths.length !== result.length) {
			assert.fail(`assumption:${filePaths.length} !== result:${result.length}`);
		}
		filePaths.forEach((file) => {
			const check = result.find((resultItem) => {
				return file === resultItem
			});

			if (!check) {
				assert.fail(`${file} is not found...`);
			}
		});
		assert.strictEqual(setting.getItemValue(ExtensionSetting.propertyIds.opacity),               Number(opacity));
		assert.strictEqual(setting.getItemValue(ExtensionSetting.propertyIds.slideIntervalUnit),     "Second");
		assert.strictEqual(setting.getItemValue(ExtensionSetting.propertyIds.slideInterval),         Number(interval))
		assert.strictEqual(setting.getItem(ExtensionSetting.propertyIds.slideRandomPlay).validValue, true);
		assert.strictEqual(pickStub.calledThrice,                                                    true);
		assert.strictEqual(inputStub.calledTwice,                                                    true);
		assert.strictEqual(fileCheckStub.calledOnce,                                                 true);
		assert.strictEqual(dirCheckStub.calledOnce,                                                  true);
		assert.strictEqual(fileStub.calledOnce,                                                      true);
		assert.strictEqual(wallpaperStub.calledOnce,                                                 true);

		inputStub.restore();
		pickStub.restore();
		fileCheckStub.restore();
		dirCheckStub.restore();
		fileStub.restore();
		wallpaperStub.restore();

		await setting.uninstall();
	}).timeout(30 * 1000);
});
