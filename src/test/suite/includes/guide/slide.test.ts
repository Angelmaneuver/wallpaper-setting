import * as assert        from "assert";
import * as sinon         from "sinon";
import * as testTarget    from "../../../../includes/guide/slide";
import { State }          from "../../../../includes/guide/base/base";
import * as Constant      from "../../../../includes/constant";
import { MultiStepInput } from "../../../../includes/utils/multiStepInput";

suite('Guide - Slide Test Suite', async () => {
	test('SlideIntervalGuide - show', async () => {
		const stateCreater  = () => ({ title: "Test Suite", resultSet: {} } as State);
		const prompt        = `Enter a number between ${Constant.minimumSlideInterval} and 65555 in Minute. (Default: 25)`;
		const inputStub     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const state         = stateCreater();

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SlideIntervalGuide(state).start(input));

		assert.strictEqual(inputStub.getCall(0).args[0].prompt, prompt);

		inputStub.restore();
	});

	test('SlideIntervalGuide - validateSlideInterval', async () => {
		assert.strictEqual(await testTarget.SlideIntervalGuide.validateSlideInterval(""),      undefined);
		assert.strictEqual(await testTarget.SlideIntervalGuide.validateSlideInterval("0.1"),   undefined);
		assert.strictEqual(await testTarget.SlideIntervalGuide.validateSlideInterval("65555"), undefined);

		assert.strictEqual(
			await testTarget.SlideIntervalGuide.validateSlideInterval("0.01"),
			`Enter a number between ${Constant.minimumSlideInterval} and 65555 for slide interval.`
		);
		assert.strictEqual(
			await testTarget.SlideIntervalGuide.validateSlideInterval("65556"),
			`Enter a number between ${Constant.minimumSlideInterval} and 65555 for slide interval.`
		);
	});
});
