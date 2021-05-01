import * as assert     from "assert";
import * as testTarget from "../../../../../includes/utils/base/string";

suite('String Utility Test Suite', () => {
	test('Format By Array', () => {
		const string1 = "String Utility Test";
		const string2 = "Success.";

		assert.strictEqual(
			`/*${string1} ${string2}*/`,
			testTarget.formatByArray(
				"/*{0} {1}*/",
				string1,
				string2
			)
		);
	});
});
