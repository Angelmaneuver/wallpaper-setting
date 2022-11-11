import * as assert     from "assert";
import * as sinon      from "sinon";
import * as path       from "path";
import * as fs         from "fs";
import * as testTarget from "../../../../../includes/guide/validator/base";

suite('Guide Validator Test Suite', async () => {
	test('validateFileExist', async () => {
		const fsMock      = sinon.mock(fs);
		const fsStats     = new fs.Stats();
		const fsStatsMock = sinon.mock(fsStats);

		const targetPath1 = path.join(__dirname, "test.png");
		const targetPath2 = path.join(__dirname, "test.jpg");
		const targetPath3 = path.join(__dirname, "test.jpeg");
		const targetPath4 = path.join(__dirname, "test.gif");
		const targetPath5 = path.join(__dirname, "test.txt");
		const targetPath6 = path.join(__dirname, "notExist.png");

		fsMock.expects("statSync").once().withArgs(targetPath1).returns(fsStats);
		fsStatsMock.expects("isFile").once().returns(true);
		assert.strictEqual(await testTarget.BaseValidator.validateFileExist(targetPath1), undefined);

		fsMock.expects("statSync").once().withArgs(targetPath2).returns(fsStats);
		fsStatsMock.expects("isFile").once().returns(true);
		assert.strictEqual(await testTarget.BaseValidator.validateFileExist(targetPath2), undefined);

		fsMock.expects("statSync").once().withArgs(targetPath3).returns(fsStats);
		fsStatsMock.expects("isFile").once().returns(true);
		assert.strictEqual(await testTarget.BaseValidator.validateFileExist(targetPath3), undefined);

		fsMock.expects("statSync").once().withArgs(targetPath4).returns(fsStats);
		fsStatsMock.expects("isFile").once().returns(true);
		assert.strictEqual(await testTarget.BaseValidator.validateFileExist(targetPath4), undefined);

		fsMock.expects("statSync").once().withArgs(targetPath5).returns(fsStats);
		fsStatsMock.expects("isFile").once().returns(true);
		assert.strictEqual(await testTarget.BaseValidator.validateFileExist(targetPath5), "Invalid path.");

		fsMock.expects("statSync").once().withArgs(targetPath6).returns(fsStats);
		fsStatsMock.expects("isFile").once().returns(false);
		assert.strictEqual(await testTarget.BaseValidator.validateFileExist(targetPath6), "Invalid path.");

		fsMock.restore();
		fsStatsMock.restore();
	});

	test('validateDirectoryExist', async () => {
		const fsMock      = sinon.mock(fs);
		const fsStats     = new fs.Stats();
		const fsStatsMock = sinon.mock(fsStats);

		const targetPath1 = path.join(__dirname, "tmp");
		const targetPath2 = path.join(__dirname, "tmp", "test.jpg");
		const targetPath3 = path.join(__dirname, "notExist");

		fsMock.expects("statSync").once().withArgs(targetPath1).returns(fsStats);
		fsStatsMock.expects("isDirectory").once().returns(true);
		assert.strictEqual(await testTarget.BaseValidator.validateDirectoryExist(targetPath1), undefined);

		fsMock.expects("statSync").once().withArgs(targetPath2).returns(fsStats);
		fsStatsMock.expects("isDirectory").once().returns(false);
		assert.strictEqual(await testTarget.BaseValidator.validateDirectoryExist(targetPath2), "Invalid path.");

		fsMock.expects("statSync").once().withArgs(targetPath3).returns(fsStats);
		fsStatsMock.expects("isDirectory").once().returns(false);
		assert.strictEqual(await testTarget.BaseValidator.validateDirectoryExist(targetPath3), "Invalid path.");

		fsMock.restore();
		fsStatsMock.restore();
	});

	test('validateRequired', async () => {
		assert.strictEqual(await testTarget.BaseValidator.validateRequired("0"),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired("-"),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired("a"),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired("A"),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired("あ"), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired("亞"), undefined);

		assert.strictEqual(await testTarget.BaseValidator.validateRequired(""),   "Required field.");
	});

	test('validateNumber', async () => {
		const name = "test item";

		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, ""),       undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "0"),      undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "65555"),  undefined);

		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "-1"),     `Enter a number between 0 and 65555 for ${name}.`);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "65556"),  `Enter a number between 0 and 65555 for ${name}.`);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "-"),      `Enter a number between 0 and 65555 for ${name}.`);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "a"),      `Enter a number between 0 and 65555 for ${name}.`);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "A"),      `Enter a number between 0 and 65555 for ${name}.`);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "あ"),     `Enter a number between 0 and 65555 for ${name}.`);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "亞"),     `Enter a number between 0 and 65555 for ${name}.`);

		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "4.5", { minimum: 4.5 }), undefined);
		assert.strictEqual(
			await testTarget.BaseValidator.validateNumber(name, "4.4", { minimum: 4.5 }),
			`Enter a number between 4.5 and 65555 for ${name}.`
		);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "4.5", { maximum: 4.5 }), undefined);
		assert.strictEqual(
			await testTarget.BaseValidator.validateNumber(name, "4.6", { maximum: 4.5 }),
			`Enter a number between 0 and 4.5 for ${name}.`
		);
		assert.strictEqual(await testTarget.BaseValidator.validateNumber(name, "4.5", { minimum: 4.4, maximum: 4.6 }), undefined);
		assert.strictEqual(
			await testTarget.BaseValidator.validateNumber(name, "4.3", { minimum: 4.4, maximum: 4.6 }),
			`Enter a number between 4.4 and 4.6 for ${name}.`
		);
		assert.strictEqual(
			await testTarget.BaseValidator.validateNumber(name, "4.7", { minimum: 4.4, maximum: 4.6 }),
			`Enter a number between 4.4 and 4.6 for ${name}.`
		);
	});

	test('validateHexColorCode', async () => {
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#000000"), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#999999"), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#aaaaaa"), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#ffffff"), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#AAAAAA"), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#FFFFFF"), undefined);

		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#000"),    undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#999"),    undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#aaa"),    undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#fff"),    undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#AAA"),    undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#FFF"),    undefined);

		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode(""),        "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("000000"),  "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("FFFFFF"),  "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("AAA"),     "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("999"),     "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#ggg"),    "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#GGG"),    "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#gggggg"), "Invalid value.");
		assert.strictEqual(await testTarget.BaseValidator.validateHexColorCode("#GGGGGG"), "Invalid value.");
	});
});
