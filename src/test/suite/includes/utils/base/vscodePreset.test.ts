import * as assert     from "assert";
import * as testTarget from "../../../../../includes/utils/base/vscodePreset";

suite('VSCode Preset Utility Test Suite', () => {
	test('getAllIcons', () => {
		const result = testTarget.VSCodePreset.getAllIcons;

		Object.keys(testTarget.VSCodePreset.Icons).forEach(
			(key) => {
				let exist = false;

				for (const icon of result) {
					exist = testTarget.VSCodePreset.Icons[key] === icon;
					if (exist) {
						break;
					}
				}

				assert.strictEqual(exist, true);
			}
		);
	});

	test('create', () => {
		const label       = "label string";
		const description = "description string";
		let result        = testTarget.VSCodePreset.create(testTarget.VSCodePreset.Icons.account, label, description);

		assert.strictEqual(result.label,       `$(account) ${label}`);
		assert.strictEqual(result.description, description);

		result            = testTarget.VSCodePreset.create(testTarget.VSCodePreset.Icons.account);

		assert.strictEqual(result.label,       testTarget.VSCodePreset.Icons.account.label);
		assert.strictEqual(result.description, testTarget.VSCodePreset.Icons.account.description);
	});
});
