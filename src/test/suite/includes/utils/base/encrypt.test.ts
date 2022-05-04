import * as assert     from "assert";
import * as testTarget from "../../../../../includes/utils/base/encrypt";

suite('Encrypt Test Suite', () => {
	test('Encrypt -> Decrypt', () => {
		const data     = `Plan text data.`;
		const password = `password`;
		const salt     = `salt`;

		const [iv, encrypted] = testTarget.encrypt(Buffer.from(data), password, salt);

		assert.strictEqual(
			(testTarget.decrypt(iv.toString("base64"), encrypted.toString("base64"), password, salt)).toString("utf8"),
			data
		);

		assert.notStrictEqual(
			(testTarget.decrypt(iv.toString("base64"), encrypted.toString("base64"), "passw0rd", salt)).toString("utf8"),
			data
		);

		assert.notStrictEqual(
			(testTarget.decrypt(iv.toString("base64"), encrypted.toString("base64"), password, "sa1t")).toString("utf8"),
			data
		);
	});
});
