import * as assert                         from "assert";
import * as sinon                          from "sinon";
import { QuickInputButton, QuickPickItem } from "vscode";
import * as testTarget                     from "../../../../../includes/guide/select/favorite";
import { MultiStepInput }                  from "../../../../../includes/utils/multiStepInput";
import {
	RegisterFavoriteGuide,
	OpenFavoriteGuide,
	FavoriteRandomSetGuide,
}                                          from "../../../../../includes/guide/favorite";
import * as Installer                      from "../../../../../includes/installer";
import { State }                           from "../../../../../includes/guide/base/base";
import { ExtensionSetting }                from "../../../../../includes/settings/extension";
import { MainWallpaper }                   from "../../../../../includes/wallpaper/main";
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

suite('Guide - SelectFavoriteProcess Test Suite', async () => {
	const stateCreater  = (setting: ExtensionSetting) => ({ title: "Test Suite", settings: setting, installer: Installer.getInstance(setting), resultSet: {} } as State);
	const itemChecker = (assumption: Array<QuickPickItem>, result: Array<QuickPickItem>) => {
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

	test('SelectSetupType', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype,                         "showQuickPick");
		const isFavoriteRegisterdStub = sinon.stub(ExtensionSetting.prototype,                       "isFavoriteRegisterd");
		const favoriteAutoSetStub     = sinon.stub(ExtensionSetting.prototype,                       "FavoriteAutoset")
		const isAutoSetStub           = sinon.stub(MainWallpaper.prototype,                          "isAutoSet");
		const favoriteOperationStub   = sinon.stub(testTarget.SelectFavoriteOperationType.prototype, "start");
		const favoriteRegisterStub    = sinon.stub(RegisterFavoriteGuide.prototype,                  "start");
		const favoriteOpenGuideStub   = sinon.stub(OpenFavoriteGuide.prototype,                      "start");
		const favoriteRandomSetStub   = sinon.stub(FavoriteRandomSetGuide.prototype,                 "start");

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[0])
		isFavoriteRegisterdStub.get(() => undefined);
		favoriteAutoSetStub.get(() => undefined);
		isAutoSetStub.get(() => undefined);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker([Constant.favoriteProcess[0], Constant.favoriteProcess[3]], pickStub.getCall(0).args[0].items);

		favoriteAutoSetStub.get(() => Constant.wallpaperType.Slide);
		isAutoSetStub.get(() => Constant.wallpaperType.Image);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker([Constant.favoriteProcess[0], Constant.favoriteProcess[3]], pickStub.getCall(1).args[0].items);

		isFavoriteRegisterdStub.get(() => { return { image: true, slide:true } } );

		pickStub.reset();
		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[1])
		favoriteAutoSetStub.get(() => undefined);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker(Constant.favoriteProcess, pickStub.getCall(0).args[0].items);

		favoriteAutoSetStub.get(() => Constant.wallpaperType.Image);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker(Constant.favoriteProcess, pickStub.getCall(1).args[0].items);

		pickStub.reset();
		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[1])
		favoriteAutoSetStub.get(() => undefined);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker(Constant.favoriteProcess, pickStub.getCall(0).args[0].items);

		favoriteAutoSetStub.get(() => Constant.wallpaperType.Slide);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker(Constant.favoriteProcess, pickStub.getCall(1).args[0].items);

		pickStub.reset();
		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[2])
		favoriteAutoSetStub.get(() => undefined);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));
		itemChecker(Constant.favoriteProcess, pickStub.getCall(0).args[0].items);

		pickStub.reset();
		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[3])
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteProcess(stateCreater(new ExtensionSetting())).start(input));

		assert.strictEqual(favoriteOperationStub.calledThrice, true);
		assert.strictEqual(favoriteRegisterStub.calledOnce,    true);
		assert.strictEqual(favoriteOpenGuideStub.calledTwice,  true);
		assert.strictEqual(favoriteRandomSetStub.calledOnce,   true);

		pickStub.restore();
		isFavoriteRegisterdStub.restore();
		favoriteAutoSetStub.restore();
		isAutoSetStub.restore();
		favoriteOperationStub.restore();
		favoriteRegisterStub.restore();
		favoriteOpenGuideStub.restore();
		favoriteRandomSetStub.restore();
	});

	test('SelectFavoriteOperationType', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype,                         "showQuickPick");
		const favoriteRegisterStub    = sinon.stub(RegisterFavoriteGuide.prototype,                  "start");

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[0])
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteOperationType(stateCreater(new ExtensionSetting()), "Register").start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[1])
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteOperationType(stateCreater(new ExtensionSetting()), "Register").start(input));

		// eslint-disable-next-line
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => args.items[2])
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectFavoriteOperationType(stateCreater(new ExtensionSetting()), "Register").start(input));

		assert.strictEqual(favoriteRegisterStub.calledTwice, true);

		pickStub.restore();
		favoriteRegisterStub.restore();
	});
});
