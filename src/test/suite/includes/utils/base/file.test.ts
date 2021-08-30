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

		mock.verify();
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
		instance.write();
		instance.write(writeOptions);

		instance.content = null;
		assert.strictEqual(instance.content,    null);
		assert.strictEqual(instance.isPresent,  false);
		assert.strictEqual(instance.toString(), "");
		assert.strictEqual(instance.toBase64(), "");

		mock.verify();
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
		const fsMock      = sinon.mock(fs);
		const fsStats     = new fs.Stats();
		const fsStatsMock = sinon.mock(fsStats);
		const extension   = "txt;"
		const targetPath  = path.join(__dirname, "tmp", `test.${extension}`);

		fsMock.expects("statSync").thrice().withArgs(targetPath).returns(fsStats);
		fsStatsMock.expects("isFile").twice().returns(true);
		fsStatsMock.expects("isFile").once().returns(false);

		assert.strictEqual(testTarget.File.isFile(targetPath),          true);
		assert.strictEqual(testTarget.File.isFile(targetPath, ['png']), false);
		assert.strictEqual(testTarget.File.isFile(targetPath),          false);

		fsMock.verify();
		fsStatsMock.verify();
		fsMock.restore();
		fsStatsMock.restore();

		assert.strictEqual(testTarget.File.isFile(""),                  false);
	});

	test('isDirectory', () => {
		const fsMock      = sinon.mock(fs);
		const fsStats     = new fs.Stats();
		const fsStatsMock = sinon.mock(fsStats);
		const targetPath  = path.join(__dirname, "tmp", "test");

		fsMock.expects("statSync").twice().withArgs(targetPath).returns(fsStats);
		fsMock.expects("statSync").once().returns(fsStats);
		fsStatsMock.expects("isDirectory").once().returns(true);
		fsStatsMock.expects("isDirectory").twice().returns(false);

		assert.strictEqual(testTarget.File.isDirectory(targetPath), true);
		assert.strictEqual(testTarget.File.isDirectory(targetPath), false);
		assert.strictEqual(testTarget.File.isDirectory(""),         false);

		fsMock.verify();
		fsStatsMock.verify();

		fsMock.restore();
		fsStatsMock.restore();
	});

	test('getFilename', () => {
		const extension   = "txt;"
		const targetPath1 = path.join(__dirname, "tmp", `test.${extension}`);
		const targetPath2 = path.join(__dirname, "tmp", `test`);
		const targetPath3 = `test`;

		assert.strictEqual(testTarget.File.getFilename(targetPath1), "test");
		assert.strictEqual(testTarget.File.getFilename(targetPath2), "test");
		assert.strictEqual(testTarget.File.getFilename(targetPath3), "test");
	});

	test('getExtension', () => {
		const extension   = "txt;"
		const targetPath1 = path.join(__dirname, "tmp", `test.${extension}`);
		const targetPath2 = path.join(__dirname, "tmp", `test`);

		assert.strictEqual(testTarget.File.getExtension(targetPath1), extension);
		assert.strictEqual(testTarget.File.getExtension(targetPath2), "");
	});

	test('getChildrens', () => {
		const rootDir     = path.join(__dirname, "tmp");
		const extension1  = `txt`;
		const extension2  = `png`;
		const fileName1   = `testFile`;
		const fileName2   = `sample`;
		const file1       = `${fileName1}.${extension1}`;
		const file2       = `${fileName2}.${extension2}`;
		const file3       = `${fileName1}.${extension2}`;
		const directory1  = `testDir`;
		const fsStats     = new fs.Stats();
		const dirent1     = new fs.Dirent();
		dirent1.name      = file1;
		const dirent2     = new fs.Dirent();
		dirent2.name      = file2;
		const dirent3     = new fs.Dirent();
		dirent3.name      = directory1;
		const dirent4     = new fs.Dirent();
		dirent4.name      = file3;
		const dirents1    = [dirent1, dirent2, dirent3];
		const dirents2    = [dirent4];

		const fsMock      = sinon.mock(fs);
		const fsStatsMock = sinon.mock(fsStats);
		const direntMock1 = sinon.mock(dirent1);
		const direntMock2 = sinon.mock(dirent2);
		const direntMock3 = sinon.mock(dirent3);
		const direntMock4 = sinon.mock(dirent4);

		fsMock.expects("statSync").exactly(4).withArgs(rootDir).returns(fsStats);
		fsStatsMock.expects("isDirectory").exactly(4).returns(true);
		fsMock.expects("readdirSync").exactly(4).withArgs(rootDir, { withFileTypes: true }).returns(dirents1);
		direntMock1.expects("isFile").exactly(4).returns(true);
		direntMock2.expects("isFile").exactly(4).returns(true);
		direntMock3.expects("isFile").exactly(4).returns(false);
		direntMock3.expects("isDirectory").once().returns(true);
		fsMock.expects("readdirSync").once().withArgs(path.join(rootDir, directory1), { withFileTypes: true }).returns(dirents2);
		direntMock4.expects("isFile").once().returns(true);

		assert.notStrictEqual(testTarget.File.getChildrens(rootDir), [file1, file2]);

		assert.notStrictEqual(
			testTarget.File.getChildrens(rootDir, { filter: { name: "test" }, fullPath: true }),
			[path.join(rootDir, file1), path.join(rootDir, file3)]
		);

		assert.notStrictEqual(
			testTarget.File.getChildrens(rootDir, { filter: { extension: [extension1] }, fullPath: true }),
			[path.join(rootDir, file1)]
		);

		assert.notStrictEqual(
			testTarget.File.getChildrens(rootDir, { filter:  { extension: [extension2] }, fullPath: true, recursive: true }),
			[path.join(rootDir, file2), path.join(rootDir, directory1, file3)]
		);

		fsMock.verify();
		fsStatsMock.verify();
		direntMock1.verify();
		direntMock2.verify();
		direntMock3.verify();
		direntMock4.verify();

		fsMock.restore();
		fsStatsMock.restore();
		direntMock1.restore();
		direntMock2.restore();
		direntMock3.restore();
		direntMock4.restore();

		assert.strictEqual(testTarget.File.getChildrens(""), undefined);
	});
});
