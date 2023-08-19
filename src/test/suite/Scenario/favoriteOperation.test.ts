import * as assert                         from "assert";
import * as sinon                          from "sinon";
import * as path                           from "path";
import { QuickInputButton, QuickPickItem } from "vscode";
import * as testTarget                     from "../../../includes/guide/favorite";
import { MultiStepInput }                  from "../../../includes/utils/multiStepInput";
import { State }                           from "../../../includes/guide/base/base";
import { ExtensionSetting }                from "../../../includes/settings/extension";
import * as Constant                       from "../../../includes/constant";
import { MainWallpaper }                   from "../../../includes/wallpaper/main";

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

interface Favorite{ [key: string]: Column }
interface Column{ [key: string]: unknown }


suite('Scenario - Favorite Operation Test Suite', async () => {
	const stateCreater   = () => ({ title: "Test Suite", resultSet: {} } as State);
	const checkFavorite  = (assumption: Favorite, result: Favorite) => {
		if (Object.keys(assumption).length !== Object.keys(result).length) {
			assert.fail(`assumption:${Object.keys(assumption).length} !== result:${Object.keys(result).length}`);
		}

		Object.keys(assumption).forEach((favoriteName) => {
			if (result[favoriteName] === undefined) {
				assert.fail(`assumption - ${favoriteName} is not found...`);
			}

			const assumptionItems = assumption[favoriteName];
			const resultItems     = result[favoriteName];

			if (Object.keys(assumptionItems).length !== Object.keys(resultItems).length) {
				assert.fail(`assumption - ${favoriteName}:${Object.keys(assumptionItems).length} !== result - ${favoriteName}:${Object.keys(resultItems).length}`);
			}

			Object.keys(assumptionItems).forEach((itemKey) => {
				if (resultItems[itemKey] === undefined) {
					assert.fail(`assumption - ${favoriteName} - ${itemKey} is not found...`);
				}

				const assumptionItem = assumptionItems[itemKey];
				const resultItem     = resultItems[itemKey];

				if (Array.isArray(assumptionItem) && Array.isArray(resultItem)) {
					compareArray(assumptionItem, resultItem);
				} else {
					if (assumptionItem !== resultItem) {
						assert.fail(`assumption - ${favoriteName} - ${itemKey}:${assumptionItem} !== result - ${favoriteName} - ${itemKey}:${resultItem}`);
					}
				}
			});
		});
	}
	const compareArray   = (array1: Array<unknown>, array2: Array<unknown>) => {
		if (array1.length !== array2.length) {
			assert.fail(`array1:${array1.length} !== array2:${array2.length}`);
		}

		for (const index in array1) {
			if (array1[index] !== array2[index]) {
				assert.fail(`array1:${array1[index]} !== array2:${array2[index]}`);
			}	
		}
	}
	const imageFavorite  = {
		"Favorite Regist Test1": { filePath: path.join(__dirname, "testDir1", "testDir2", "test.png"), opacity: 0.85 },
		"Favorite Regist Test2": { filePath: path.join(__dirname, "testDir1", "test.gif"),             opacity: 0.75 },
	} as Favorite;
	const slideFavorite  = {
		"Favorite Regist Test4": {
			slideFilePaths:        [path.join(__dirname, "testDir1", "test.png"), path.join(__dirname, "testDir1", "testDir2", "test.gif")],
			opacity:               0.65,
			slideInterval:         60,
			slideIntervalUnit:     "Second",
			slideRandomPlay:       false,
			slideEffectFadeIn:     true,
			slideLoadWaitComplete: false,
		},
		"Favorite Regist Test3": {
			slideFilePaths:        [path.join(__dirname, "testDir1", "test.jpeg"), path.join(__dirname, "testDir1", "testDir2", "test.jpeg")],
			opacity:               0.55,
			slideInterval:         30,
			slideIntervalUnit:     "Hour",
			slideRandomPlay:       true,
			slideEffectFadeIn:     false,
			slideLoadWaitComplete: true,
		}
	}

	test('Image Regist', async () => {
		const assumption: Favorite          = {};
		assumption["Favorite Regist Test2"] = { filePath: path.join(__dirname, "testDir2", "test.jpeg"), opacity: 0.45 };
		const inputStub                     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const state                         = stateCreater();
		const setupInstance                 = new ExtensionSetting();

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.filePath, assumption["Favorite Regist Test2"].filePath);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.opacity,  assumption["Favorite Regist Test2"].opacity);
		inputStub.resolves("Favorite Regist Test2");
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.RegisterFavoriteGuide(state, Constant.types.wallpaper.image).start(input));

		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.register("Favorite Regist Test2"));
		checkFavorite(assumption, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);

		inputStub.restore();
	}).timeout(30 * 1000);

	test('Image Regist - Override', async () => {
		const assumption: Favorite          = {};
		assumption["Favorite Regist Test2"] = imageFavorite["Favorite Regist Test2"];
		const inputStub                     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const pickStub                      = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const state                         = stateCreater();
		const setupInstance                 = new ExtensionSetting();
		const confirmItems                  = Constant.confirmItem(
			Constant.confirmItemType.confirm,
			{
				item1: Constant.messages.placeholder.favorite.register.override.confirm.yes,
				item2: Constant.messages.placeholder.favorite.register.override.confirm.no,
			}
		)

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.filePath, assumption["Favorite Regist Test2"].filePath);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.opacity,  assumption["Favorite Regist Test2"].opacity);
		inputStub.resolves("Favorite Regist Test2");
		pickStub.resolves(confirmItems[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.RegisterFavoriteGuide(state, Constant.types.wallpaper.image).start(input));

		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.register("Favorite Regist Test2"));
		checkFavorite(assumption, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);

		inputStub.restore();
		pickStub.restore();
	}).timeout(30 * 1000);

	test('Image Regist - Multiple', async () => {
		const assumption: Favorite          = imageFavorite;
		const inputStub                     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const pickStub                      = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const state                         = stateCreater();
		const setupInstance                 = new ExtensionSetting();
		const confirmItems                  = Constant.confirmItem(
			Constant.confirmItemType.confirm,
			{
				item1: Constant.messages.placeholder.favorite.register.override.confirm.yes,
				item2: Constant.messages.placeholder.favorite.register.override.confirm.no,
			}
		)

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.filePath, assumption["Favorite Regist Test1"].filePath);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.opacity,  assumption["Favorite Regist Test1"].opacity);
		inputStub.resolves("Favorite Regist Test1");
		pickStub.resolves(confirmItems[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.RegisterFavoriteGuide(state, Constant.types.wallpaper.image).start(input));

		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.register("Favorite Regist Test1"));
		checkFavorite(assumption, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);

		inputStub.restore();
		pickStub.restore();
	}).timeout(30 * 1000);

	test('Slide Regist', async () => {
		const assumption: Favorite          = {};
		assumption["Favorite Regist Test4"] = slideFavorite["Favorite Regist Test4"];
		const inputStub                     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const state                         = stateCreater();
		const setupInstance                 = new ExtensionSetting();

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideFilePaths,        assumption["Favorite Regist Test4"].slideFilePaths);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.opacity,               assumption["Favorite Regist Test4"].opacity);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideInterval,         assumption["Favorite Regist Test4"].slideInterval);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideIntervalUnit,     assumption["Favorite Regist Test4"].slideIntervalUnit);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideRandomPlay,       assumption["Favorite Regist Test4"].slideRandomPlay);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideEffectFadeIn,     assumption["Favorite Regist Test4"].slideEffectFadeIn);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideLoadWaitComplete, assumption["Favorite Regist Test4"].slideLoadWaitComplete);
		inputStub.resolves("Favorite Regist Test4");
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.RegisterFavoriteGuide(state, Constant.types.wallpaper.slide).start(input));

		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.register("Favorite Regist Test4"));
		checkFavorite(imageFavorite, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite(assumption,    (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		inputStub.restore();
	}).timeout(30 * 1000);

	test('Slide Regist - Multiple', async () => {
		const assumption: Favorite          = slideFavorite;
		const inputStub                     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const state                         = stateCreater();
		const setupInstance                 = new ExtensionSetting();

		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideFilePaths,        assumption["Favorite Regist Test3"].slideFilePaths);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.opacity,               assumption["Favorite Regist Test3"].opacity);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideInterval,         assumption["Favorite Regist Test3"].slideInterval);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideIntervalUnit,     assumption["Favorite Regist Test3"].slideIntervalUnit);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideRandomPlay,       assumption["Favorite Regist Test3"].slideRandomPlay);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideEffectFadeIn,     assumption["Favorite Regist Test3"].slideEffectFadeIn);
		await setupInstance.setItemValue(ExtensionSetting.propertyIds.slideLoadWaitComplete, assumption["Favorite Regist Test3"].slideLoadWaitComplete);
		inputStub.resolves("Favorite Regist Test3");
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.RegisterFavoriteGuide(state, Constant.types.wallpaper.slide).start(input));

		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.register("Favorite Regist Test3"));
		checkFavorite(imageFavorite, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite(assumption,    (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		inputStub.restore();
	}).timeout(30 * 1000);

	test('Prev', async () => {
		const pickStub                      = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const state                         = stateCreater();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.image).start(input));

		assert.strictEqual(state.reload, undefined);

		pickStub.restore();
	}).timeout(30 * 1000);

	test('Set', async () => {
		const pickStub                      = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const installStub                   = sinon.stub(MainWallpaper.prototype,  "install");
		const installAsSlideStub            = sinon.stub(MainWallpaper.prototype,  "installAsSlide");
		let   state                         = stateCreater();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onFirstCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onSecondCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.image).start(input));
		assert.strictEqual(state.reload, true);

		let setting                         = new ExtensionSetting();
		assert.strictEqual(imageFavorite["Favorite Regist Test2"].filePath, setting.getItemValue(ExtensionSetting.propertyIds.filePath));
		assert.strictEqual(imageFavorite["Favorite Regist Test2"].opacity,  setting.getItemValue(ExtensionSetting.propertyIds.opacity));

		pickStub.reset();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onFirstCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onSecondCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		state                               = stateCreater();
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.slide).start(input));
		assert.strictEqual(state.reload, true);

		setting                             = new ExtensionSetting();
		compareArray(slideFavorite["Favorite Regist Test4"].slideFilePaths,              setting.getItemValue(ExtensionSetting.propertyIds.slideFilePaths) as Array<unknown>);
		assert.strictEqual(slideFavorite["Favorite Regist Test4"].opacity,               setting.getItemValue(ExtensionSetting.propertyIds.opacity));
		assert.strictEqual(slideFavorite["Favorite Regist Test4"].slideInterval,         setting.getItemValue(ExtensionSetting.propertyIds.slideInterval));
		assert.strictEqual(slideFavorite["Favorite Regist Test4"].slideIntervalUnit,     setting.getItemValue(ExtensionSetting.propertyIds.slideIntervalUnit));
		assert.strictEqual(slideFavorite["Favorite Regist Test4"].slideRandomPlay,       setting.slideRandomPlay.validValue);
		assert.strictEqual(slideFavorite["Favorite Regist Test4"].slideEffectFadeIn,     setting.slideEffectFadeIn.validValue);
		assert.strictEqual(slideFavorite["Favorite Regist Test4"].slideLoadWaitComplete, setting.slideLoadWaitComplete.validValue);

		checkFavorite(imageFavorite, (setting.getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite(slideFavorite, (setting.getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		assert.strictEqual(installStub.calledOnce,        true);
		assert.strictEqual(installAsSlideStub.calledOnce, true);

		pickStub.restore();
		installStub.restore();
		installAsSlideStub.restore();
	}).timeout(30 * 1000);

	test('Delete', async () => {
		const pickStub                      = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		let   state                         = stateCreater();
		const confirmItems                  = Constant.confirmItem(
			Constant.confirmItemType.confirm,
			{
				item1: Constant.messages.placeholder.favorite.register.override.confirm.yes,
				item2: Constant.messages.placeholder.favorite.register.override.confirm.no,
			}
		)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onFirstCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onSecondCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		pickStub.onThirdCall().resolves(confirmItems[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.image).start(input));
		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.delete("Favorite Regist Test2"));
		checkFavorite({ "Favorite Regist Test1": imageFavorite["Favorite Regist Test1"] }, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite(slideFavorite, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		pickStub.reset()
		state                               = stateCreater();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onFirstCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onSecondCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		pickStub.onThirdCall().resolves(confirmItems[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.slide).start(input));
		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.delete("Favorite Regist Test3"));
		checkFavorite({ "Favorite Regist Test1": imageFavorite["Favorite Regist Test1"] }, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite({ "Favorite Regist Test4": slideFavorite["Favorite Regist Test4"] }, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		pickStub.reset()
		state                               = stateCreater();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onFirstCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onSecondCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		pickStub.onThirdCall().resolves(confirmItems[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.image).start(input));
		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.delete("Favorite Regist Test1"));
		checkFavorite({},                                                                  (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite({ "Favorite Regist Test4": slideFavorite["Favorite Regist Test4"] }, (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		pickStub.reset()
		state                               = stateCreater();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onFirstCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onSecondCall().callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		pickStub.onThirdCall().resolves(confirmItems[0]);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.OpenFavoriteGuide(state, Constant.types.wallpaper.slide).start(input));
		assert.strictEqual(state.message, Constant.messages.showInformationMessage.favorite.delete("Favorite Regist Test4"));
		checkFavorite({},                                                                  (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteImageSet)) as Favorite);
		checkFavorite({},                                                                  (new ExtensionSetting().getItemValue(ExtensionSetting.propertyIds.favoriteSlideSet)) as Favorite);

		pickStub.restore();
		await new ExtensionSetting().uninstall();
	}).timeout(30 * 1000);
});
