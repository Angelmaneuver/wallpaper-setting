import * as assert        from "assert";
import * as sinon         from "sinon";
import * as testTarget    from "../../../../includes/guide/slide";
import { State }          from "../../../../includes/guide/base/base";
import * as Constant      from "../../../../includes/constant";
import { MultiStepInput } from "../../../../includes/utils/multiStepInput";

suite('Guide - Slide Test Suite', async () => {
	test('SlideIntervalGuide - show', async () => {
		const stateCreater  = () => ({ title: "Test Suite", resultSet: {} } as State);
		const prompt        = Constant.messages.placeholder.slide.interval.time(
			Constant.values.slide.min,
			"Minute",
		);
		const inputStub     = sinon.stub(MultiStepInput.prototype, "showInputBox");
		const state         = stateCreater();

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.SlideIntervalGuide(state).start(input));

		assert.strictEqual(inputStub.getCall(0).args[0].prompt, prompt);

		inputStub.restore();
	});

	test('SlideIntervalGuide - validateSlideInterval', async () => {
		const message = Constant.messages.validate.number.between(
			Constant.values.slide.min,
			65555,
			Constant.words.slideInterval,
		);

		assert.strictEqual(await testTarget.SlideIntervalGuide.validateSlideInterval(""),      undefined);
		assert.strictEqual(await testTarget.SlideIntervalGuide.validateSlideInterval("0.1"),   undefined);
		assert.strictEqual(await testTarget.SlideIntervalGuide.validateSlideInterval("65555"), undefined);

		assert.strictEqual(
			await testTarget.SlideIntervalGuide.validateSlideInterval("0.01"),
			message,
		);
		assert.strictEqual(
			await testTarget.SlideIntervalGuide.validateSlideInterval("65556"),
			message,
		);
	});
});
