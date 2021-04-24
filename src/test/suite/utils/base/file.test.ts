import * as assert     from "assert";
import * as sinon      from "sinon";
import * as fs         from "fs";
import * as testTarget from "../../../../includes/utils/base/file";

suite('File Utility Test Suite', () => {
	test('constructor', () => {
		const mock         = sinon.mock(fs);
		const extension  = "txt;"
		const targetPath = `/tmp/test.${extension}`;
		const result     = "file utility test."

		mock.expects("readFileSync").once().withArgs(targetPath).returns(result);

		const instance   = new testTarget.File(targetPath);
		assert.strictEqual(instance.content,    result);
		assert.strictEqual(instance.path,       targetPath);
		assert.strictEqual(instance.extension,  extension);
		assert.strictEqual(instance.isPresent,  true);
		assert.strictEqual(instance.toString(), result);
		assert.strictEqual(instance.toBase64(), result);

		mock.restore();
	});

	test('constructor - with options', () => {
		const mock         = sinon.mock(fs);
		const targetPath   = "/tmp/test.txt";
		const readOptions  = { encoding: "utf-8", flag: "a" }
		const result       = "file utility test."
		const plus         = " write";
		const writeOptions = { encoding: "utf-8", mode: 0o777, flag: "a" }

		mock.expects("readFileSync").once().withArgs(targetPath, readOptions).returns(result);
		mock.expects("writeFileSync").once().withArgs(targetPath, `${result}${plus}`);
		mock.expects("writeFileSync").once().withArgs(targetPath, `${result}${plus}`, writeOptions);

		const instance   = new testTarget.File(targetPath, readOptions);
		assert.strictEqual(instance.content, result);
		instance.content = `${result}${plus}`;
		instance.write(writeOptions);

		mock.restore();
	});
});
