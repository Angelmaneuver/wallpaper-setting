import * as assert     from "assert";
import * as sinon      from "sinon";
import * as path       from "path";
import * as fs         from "fs";
import * as testTarget from "../../../../../includes/utils/base/file";

suite('File Utility Test Suite', () => {
	test('constructor', () => {
		const mock       = sinon.mock(fs);
		const extension  = "txt;"
		const targetPath = path.join(__dirname, "tmp", `test.${extension}`);
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
		const targetPath   = path.join(__dirname, "tmp", "test.txt");
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

		instance.content = null;
		assert.strictEqual(instance.content,    null);
		assert.strictEqual(instance.isPresent,  false);
		assert.strictEqual(instance.toString(), "");
		assert.strictEqual(instance.toBase64(), "");

		mock.restore();
	});

	test('constructor - invalid parameter', () => {
		try {
			new testTarget.File("");
		} catch (e) {
			assert(e instanceof ReferenceError);
		}
	});

	test('isFile', () => {
		const mock1      = sinon.mock(fs);
		const extension  = "txt;"
		const targetPath = path.join(__dirname, "tmp", `test.${extension}`);
		const fsStats    = new fs.Stats();
		const mock2      = sinon.mock(fsStats);

		mock1.expects("statSync").thrice().withArgs(targetPath).returns(fsStats);
		mock2.expects("isFile").twice().returns(true);
		mock2.expects("isFile").once().returns(false);

		assert.strictEqual(testTarget.File.isFile(targetPath),          true);
		assert.strictEqual(testTarget.File.isFile(targetPath, ['png']), false);
		assert.strictEqual(testTarget.File.isFile(targetPath),          false);
		assert.strictEqual(testTarget.File.isFile(""),                  false);

		mock1.restore();
		mock2.restore();
	});

	test('isDirectory', () => {
		const mock1      = sinon.mock(fs);
		const targetPath = path.join(__dirname, "tmp", "test");
		const fsStats    = new fs.Stats();
		const mock2      = sinon.mock(fsStats);

		mock1.expects("statSync").thrice().withArgs(targetPath).returns(fsStats);
		mock2.expects("isDirectory").once().returns(true);
		mock2.expects("isDirectory").once().returns(false);

		assert.strictEqual(testTarget.File.isDirectory(targetPath), true);
		assert.strictEqual(testTarget.File.isDirectory(targetPath), false);
		assert.strictEqual(testTarget.File.isDirectory(""),         false);

		mock1.restore();
		mock2.restore();
	});

	test('getExtension', () => {
		const extension   = "txt;"
		const targetPath1 = path.join(__dirname, "tmp", `test.${extension}`);
		const targetPath2 = path.join(__dirname, "tmp", `test`);

		assert.strictEqual(testTarget.File.getExtension(targetPath1), extension);
		assert.strictEqual(testTarget.File.getExtension(targetPath2), "");
	});

	test('getChildrens', () => {
		const rootDir    = path.join(__dirname, "tmp");
		const extension1 = `txt`;
		const extension2 = `png`;
		const fileName1  = `testFile`;
		const fileName2  = `sample`;
		const file1      = `${fileName1}.${extension1}`;
		const file2      = `${fileName2}.${extension2}`;
		const file3      = `${fileName1}.${extension2}`;
		const directory1 = `testDir`;
		const fsStats    = new fs.Stats();
		const dirent1    = new fs.Dirent();
		dirent1.name     = file1;
		const dirent2    = new fs.Dirent();
		dirent2.name     = file2;
		const dirent3    = new fs.Dirent();
		dirent3.name     = directory1;
		const dirent4    = new fs.Dirent();
		dirent4.name     = file3;

		const mock1      = sinon.mock(fs);
		const mock2      = sinon.mock(fsStats);
		const mock3      = sinon.mock(dirent1);
		const mock4      = sinon.mock(dirent2);
		const mock5      = sinon.mock(dirent3);
		const mock6      = sinon.mock(dirent4);

		const dirents1   = [dirent1, dirent2, dirent3];
		const dirents2   = [dirent4];

		mock1.expects("statSync").thrice().withArgs(rootDir).returns(fsStats);
		mock2.expects("isDirectory").thrice().returns(true);
		mock1.expects("readdirSync").thrice().withArgs(rootDir, { withFileTypes: true }).returns(dirents1);
		mock3.expects("isFile").thrice().returns(true);
		mock4.expects("isFile").thrice().returns(true);
		mock5.expects("isFile").thrice().returns(false);
		mock5.expects("isDirectory").once().returns(true);
		mock1.expects("readdirSync").once().withArgs(path.join(rootDir, directory1), { withFileTypes: true }).returns(dirents2);
		mock6.expects("isFile").once().returns(true);

		assert.notStrictEqual(testTarget.File.getChldrens(rootDir), [file1, file2]);

		assert.notStrictEqual(
			testTarget.File.getChldrens(rootDir, { filters: [extension1], fullPath: true }),
			[path.join(rootDir, file1)]
		);

		assert.notStrictEqual(
			testTarget.File.getChldrens(rootDir, { filters: [extension2], fullPath: true, recursive: true }),
			[path.join(rootDir, file2), path.join(rootDir, directory1, file3)]
		);

		mock1.restore();
		mock2.restore();
		mock3.restore();
		mock4.restore();
		mock5.restore();

		assert.strictEqual(testTarget.File.getChldrens(""), undefined);
	});
});
