import * as assert                         from "assert";
import * as sinon                          from "sinon";
import { QuickInputButton, QuickPickItem } from "vscode";
import * as testTarget                     from "../../../../includes/guide/favorite";
import { MultiStepInput }                  from "../../../../includes/utils/multiStepInput";
import { State }                           from "../../../../includes/guide/base/base";
import { ExtensionSetting }                from "../../../../includes/settings/extension";
import * as Constant                       from "../../../../includes/constant";
import * as Favorite                       from "../../../../includes/favorite";

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

suite('Guide - Favorite Test Suite', async () => {
	const stateCreater   = () => ({ title: "Test Suite", guideGroupId: "test", resultSet: {} } as State);

	test('SelectExecuteOperationFavoriteGuide', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype,   "showQuickPick");
		const state                   = stateCreater();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[3]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SelectExecuteOperationFavoriteGuide(state, Constant.wallpaperType.Image, "test").start(input));

		pickStub.restore();
	});

	test('FavoriteRandomSetGuide', async () => {
		const pickStub                = sinon.stub(MultiStepInput.prototype,   "showQuickPick");
		const favoriteStub            = sinon.stub(Favorite,                   "randomSet");
		const isFavoriteRegisterdStub = sinon.stub(ExtensionSetting.prototype, "isFavoriteRegisterd");
		const favoriteAutoSetStub     = sinon.stub(ExtensionSetting.prototype, "FavoriteAutoset")
		let   state                   = stateCreater();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, true);

		state                         = stateCreater();
		isFavoriteRegisterdStub.get(() => { return { image: false, slide: true } } );
		favoriteAutoSetStub.get(() => Constant.wallpaperType.Slide );
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, true);

		state                         = stateCreater();
		isFavoriteRegisterdStub.get(() => { return { image: true, slide: false } } );
		favoriteAutoSetStub.get(() => Constant.wallpaperType.Image );
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, true);

		state                         = stateCreater();
		isFavoriteRegisterdStub.get(() => { return { image: true, slide: true } } );
		favoriteAutoSetStub.get(() => undefined );
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                              true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue,       true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSetFilter.validValue, "All");

		state                         = stateCreater();
		pickStub.reset();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(0).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(1).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		isFavoriteRegisterdStub.get(() => { return { image: true, slide: true } } );
		favoriteAutoSetStub.get(() => undefined );
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                              true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue,       true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSetFilter.validValue, "Image");

		state                         = stateCreater();
		pickStub.reset();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(0).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(1).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		isFavoriteRegisterdStub.get(() => { return { image: true, slide: true } } );
		favoriteAutoSetStub.get(() => undefined );
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                              true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue,       true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSetFilter.validValue, "Slide");

		state                         = stateCreater();
		pickStub.reset();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(0).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(1).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[3]; })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.onCall(2).callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		isFavoriteRegisterdStub.get(() => { return { image: true, slide: true } } );
		favoriteAutoSetStub.get(() => undefined );
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                              undefined);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue,       true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSetFilter.validValue, "Slide");

		state                         = stateCreater();
		pickStub.reset()
		isFavoriteRegisterdStub.reset()
		favoriteAutoSetStub.reset()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        undefined);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, false);

		state                         = stateCreater();
		pickStub.reset()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        undefined);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, false);

		assert.strictEqual(favoriteStub.callCount,                              7);

		pickStub.restore();
		favoriteStub.restore();
		isFavoriteRegisterdStub.restore()
		favoriteAutoSetStub.restore()
		await new ExtensionSetting().uninstall();
	});
});
