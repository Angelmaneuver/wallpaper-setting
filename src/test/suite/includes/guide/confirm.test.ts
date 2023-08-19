import * as assert        from "assert";
import * as sinon         from "sinon";
import * as testTarget    from "../../../../includes/guide/confirm";
import { QuickPickItem }  from "vscode";
import { MultiStepInput } from "../../../../includes/utils/multiStepInput";
import { State }          from "../../../../includes/guide/base/base";
import {
	confirmItemType,
	confirmItem,
}                         from "../../../../includes/constant";

suite('Guide - Confirm Test Suite', async () => {
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

	test('constructor', async () => {
		const description1 = "description 1";
		const description2 = "description 2";
		const items        = confirmItem(confirmItemType.confirm, { item1: description1, item2: description2 });
		const pickStub     = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const callback     = { function: (async (value1: string, value2: number) => { return }) as (...args: Array<unknown>) => Promise<void> } // eslint-disable-line @typescript-eslint/no-unused-vars
		const callbackStub = sinon.stub(callback, "function");
		const state        = { title: "Test Suite", resultSet: {} } as State;
		const instance     = new testTarget.BaseConfirmGuide(state, { yes: description1, no: description2 }, callback.function, "test string", 1000);

		pickStub.onFirstCall().resolves(items[0]);
		pickStub.onSecondCall().resolves(items[1]);

		await MultiStepInput.run((input: MultiStepInput) => instance.start(input));
		await MultiStepInput.run((input: MultiStepInput) => instance.start(input));

		itemchecker(items, pickStub.getCall(0).args[0].items)
		assert.strictEqual(callbackStub.calledOnce, true);

		pickStub.restore();
	});
});
