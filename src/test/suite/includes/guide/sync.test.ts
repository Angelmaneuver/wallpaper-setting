import * as assert     from "assert";
import * as path       from "path";
import * as sinon      from "sinon";
import * as testTarget from "../../../../includes/guide/sync";
import * as Constant   from "../../../../includes/constant";
import { File }        from "../../../../includes/utils/base/file";

suite('Guide - Sync Test Suite', async () => {
	test('SyncImageFilePathGuide - validateFilePath', async () => {
		const warning         = `The image file size that can be sync is less than ${Constant.syncImageSize4Display}.`;
		const filePath        = path.join(__dirname, "testDir", "test.png");
		const isFileStub      = sinon.stub(File, "isFile");
		const getFileSizeStub = sinon.stub(File, "getFilesize");

		isFileStub.onFirstCall().returns(false);
		isFileStub.onSecondCall().returns(true);
		isFileStub.onThirdCall().returns(true);

		getFileSizeStub.onFirstCall().returns(501 * 1024);
		getFileSizeStub.onSecondCall().returns(500 * 1024);

		assert.strictEqual(await testTarget.SyncImageFilePathGuide.validateFilePath(""),       "Invalid path.");
		assert.strictEqual(await testTarget.SyncImageFilePathGuide.validateFilePath(filePath), warning);
		assert.strictEqual(await testTarget.SyncImageFilePathGuide.validateFilePath(filePath), undefined);

		getFileSizeStub.restore();
		isFileStub.restore();
	});
});
