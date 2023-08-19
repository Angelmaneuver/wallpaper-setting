import * as assert                         from "assert";
import * as sinon                          from "sinon";
import { QuickInputButton, QuickPickItem } from "vscode";
import * as testTarget                     from "../../../../../includes/guide/select/wallpaper";
import { MultiStepInput }                  from "../../../../../includes/utils/multiStepInput";
import { BaseInputGuide }                  from "../../../../../includes/guide/base/input";
import * as Installer                      from "../../../../../includes/installer";
import { State }                           from "../../../../../includes/guide/base/base";
import { MainWallpaper }                   from "../../../../../includes/wallpaper/main";
import { ExtensionSetting }                from "../../../../../includes/settings/extension";
import * as Constant                       from "../../../../../includes/constant";

interface QuickPickParameters<T extends QuickPickItem> {
	title:        string;
	step:         number;
	totalSteps:   number;
	items:        T[];
	activeItem?:  T;
	placeholder:  string;
	buttons?:     QuickInputButton[];
	shouldResume: () => Thenable<boolean>;
}

suite('Guide - Wallpaper Operation Test Suite', async () => {
	const stateCreater  = (setting: ExtensionSetting) => ({ title: "Test Suite", settings: setting, installer: Installer.getInstance(setting), resultSet: {} } as State);

	test('delegation2Transition, autoSetByFavorite, installByType', async () => {
		await new ExtensionSetting().setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet, true);

		const isAutoSetStub      = sinon.stub(MainWallpaper.prototype, "isAutoSet");
		const installStub        = sinon.stub(MainWallpaper.prototype, "install");
		const installAsSlideStub = sinon.stub(MainWallpaper.prototype, "installAsSlide");
		const setting            = new ExtensionSetting();
		let   state              = stateCreater(setting);

		isAutoSetStub.get(() => undefined);
		
		await new ExtensionSetting().setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet, true);
		testTarget.delegation2Transition(new BaseInputGuide(state), state, true);
		assert.strictEqual(state.reload, true);

		state                    = stateCreater(setting);
		testTarget.delegation2Transition(new BaseInputGuide(state), state);
		assert.strictEqual(state.reload, undefined);

		await new ExtensionSetting().setItemValue(ExtensionSetting.propertyIds.favoriteRandomSet, false);
		state                    = stateCreater(setting);
		testTarget.delegation2Transition(new BaseInputGuide(state), state);
		assert.strictEqual(state.reload, undefined);

		state                    = stateCreater(setting);
		isAutoSetStub.get(() => Constant.types.wallpaper.image);
		testTarget.delegation2Transition(new BaseInputGuide(state), state, true);
		assert.strictEqual(state.reload, true);

		state                    = stateCreater(setting);
		isAutoSetStub.get(() => Constant.types.wallpaper.slide);
		testTarget.delegation2Transition(new BaseInputGuide(state), state, true);
		assert.strictEqual(state.reload, true);

		assert.strictEqual(installStub.calledOnce,        true);
		assert.strictEqual(installAsSlideStub.calledOnce, true);

		isAutoSetStub.restore();
		installStub.restore();
		installAsSlideStub.restore();
		await new ExtensionSetting().uninstall();
	});

	test('SelectSetupType - getExecute', async () => {
		const pickStub           = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const installStub        = sinon.stub(MainWallpaper.prototype,      "install");
		const installAsSlideStub = sinon.stub(MainWallpaper.prototype,      "installAsSlide");

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectSetupType(stateCreater(new ExtensionSetting())).start(input));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectSetupType(stateCreater(new ExtensionSetting())).start(input));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectSetupType(stateCreater(new ExtensionSetting())).start(input));

		assert.strictEqual(installStub.calledOnce,        true);
		assert.strictEqual(installAsSlideStub.calledOnce, true);

		pickStub.restore();
		installStub.restore();
		installAsSlideStub.restore();
	});
});
