import * as assert                         from "assert";
import * as sinon                          from "sinon";
import { QuickInputButton, QuickPickItem } from "vscode";
import * as testTarget                     from "../../../../includes/guide/favorite";
import { MultiStepInput }                  from "../../../../includes/utils/multiStepInput";
import { State }                           from "../../../../includes/guide/base/base";
import { ExtensionSetting }                from "../../../../includes/settings/extension";
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

suite('Guide - Slide Test Suite', async () => {
	const stateCreater   = () => ({ title: "Test Suite", guideGroupId: "test", resultSet: {} } as State);

	test('FavoriteRandomSetGuide', async () => {
		const pickStub     = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const favoriteStub = sinon.stub(Favorite, "randomSet");
		let   state        = stateCreater();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[0]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        true);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, true);

		state              = stateCreater();
		pickStub.reset()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[1]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        undefined);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, false);

		state              = stateCreater();
		pickStub.reset()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pickStub.callsFake(async (args: QuickPickParameters<any>): Promise<QuickPickItem> => { return args.items[2]; })
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.FavoriteRandomSetGuide(state).start(input));
		assert.strictEqual(state.reload,                                        undefined);
		assert.strictEqual(new ExtensionSetting().favoriteRandomSet.validValue, false);

		assert.strictEqual(favoriteStub.calledTwice,                            true);

		pickStub.restore();
		favoriteStub.restore();
		await new ExtensionSetting().uninstall();
	});
});
