import * as assert     from "assert";
import * as testTarget from "../../../../includes/guide/opacity";
import * as Constant   from "../../../../includes/constant";

suite('Guide - Opacity Test Suite', async () => {
	test('validateOpacity', async () => {
		assert.strictEqual(await testTarget.OpacityGuide.validateOpacity(""),    undefined);
		assert.strictEqual(await testTarget.OpacityGuide.validateOpacity("0.5"), undefined);
		assert.strictEqual(await testTarget.OpacityGuide.validateOpacity("1"),   undefined);

		assert.strictEqual(
			await testTarget.OpacityGuide.validateOpacity("0.49"),
			`Enter a number between ${Constant.maximumOpacity} and ${Constant.minimumOpacity} for opacity.`
		);
		assert.strictEqual(
			await testTarget.OpacityGuide.validateOpacity("1.1"),
			`Enter a number between ${Constant.maximumOpacity} and ${Constant.minimumOpacity} for opacity.`
		);
	});
});
