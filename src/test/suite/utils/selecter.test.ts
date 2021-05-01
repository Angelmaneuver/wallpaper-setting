import * as assert     from "assert";
import * as sinon      from "sinon";
import * as path       from "path";
import * as vscode     from "vscode";
import * as Constant   from "../../../includes/constant";
import * as testTarget from "../../../includes/utils/selecter";

suite('File Dialog Utility Test Suite', async () => {
	test('constructor', async () => {
		const instance   = new testTarget.Selecter({});

		assert.strictEqual(instance.canSelectFolders, false);
		assert.strictEqual(instance.canSelectFiles,   true);
		assert.strictEqual(instance.canSelectMany,    false);
		assert.strictEqual(instance.openLable,        "");
		assert.notStrictEqual(instance.filters,       {});
		assert.strictEqual(instance.path,             "");

		const targetPath = path.join(__dirname, "testDir", "testFile.txt");
		const mock       = sinon.mock(vscode.window);

		mock.expects("showOpenDialog").once().withArgs({
			canSelectFolders: false,
			canSelectFiles:   true,
			canSelectMany:    false,
			openLabel:        "",
			filters:          {},
		}).returns([{ fsPath: targetPath}]);

		assert.strictEqual(await instance.openFileDialog(), instance);
		assert.strictEqual(instance.path,                   targetPath);
	});

	test('constructor - with options', () => {
		const instance   = new testTarget.Selecter({
			canSelectFolders: true,
			canSelectFiles:   false,
			canSelectMany:    true,
			openLable:        "label",
			filters:          { Images: Constant.applyImageFile }
		});

		assert.strictEqual(instance.canSelectFolders, true);
		assert.strictEqual(instance.canSelectFiles,   false);
		assert.strictEqual(instance.canSelectMany,    true);
		assert.strictEqual(instance.openLable,        "label");
		assert.notStrictEqual(instance.filters,       { Images: Constant.applyImageFile });
	});
});
