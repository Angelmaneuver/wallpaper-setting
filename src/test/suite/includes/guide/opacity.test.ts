import * as assert     from "assert";
import * as testTarget from "../../../../includes/guide/opacity";
import * as Constant   from "../../../../includes/constant";

suite('Guide - Opacity Test Suite', async () => {
	const message = Constant.messages.validate.number.between(
		Constant.values.opacity.max,
		Constant.values.opacity.min,
		"opacity",
	);

	test('validateOpacity', async () => {
		assert.strictEqual(await testTarget.OpacityGuide.validateOpacity(""),    undefined);
		assert.strictEqual(await testTarget.OpacityGuide.validateOpacity("0.5"), undefined);
		assert.strictEqual(await testTarget.OpacityGuide.validateOpacity("1"),   undefined);

		assert.strictEqual(
			await testTarget.OpacityGuide.validateOpacity("0.49"),
			message,
		);
		assert.strictEqual(
			await testTarget.OpacityGuide.validateOpacity("1.1"),
			message,
		);
	});
});
