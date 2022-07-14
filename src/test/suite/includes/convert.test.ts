import * as assert          from "assert";
import * as path            from "path";
import * as fs              from "fs";
import * as sinon           from "sinon";
import * as testTarget      from "../../../includes/convert";
import { WorkbenchSetting } from "../../../includes/settings/workbench";
import { Optional }         from "../../../includes/utils/base/optional";

suite('Convert Test Suite', async () => {
	const name             = "theme color";
	const base             = "0.7";
	const overlap          = "0.3";
	const selection        = "0.9";
	const location         = path.dirname(Optional.ofNullable(require.main?.filename).orElseThrow(new Error()));
	const jsonFileName     = "test.json";
	const jsonFileFullPath = path.join(location, jsonFileName);

	test('Nothing', async () => {
		const fsStub  = sinon.stub(fs, "readFileSync");

		fsStub.withArgs(jsonFileFullPath).returns("{}");

		testTarget.theme2transparancy(name, jsonFileFullPath, base, overlap, selection);

		assert.deepStrictEqual(new WorkbenchSetting().get("colorCustomizations"), {});

		fsStub.restore();
	}).timeout(30 * 1000);

	test('Convert', async () => {
		const fsStub  = sinon.stub(fs, "readFileSync");

		fsStub.withArgs(jsonFileFullPath).returns(`{
	"name": "test",
	"colors": {
		"activityBar.background": "#000000",
		"editor.background": "#111111",
		"quickInput.background": "#FFFFFF",
		"sideBar.background": "#FFF",
		"test": "ABC"
	}
}`);

		await testTarget.theme2transparancy(name, jsonFileFullPath, base, overlap, selection);

		const data: Record<string, Record<string, string>> = {};
		data[`[${name}]`]                                  = {}
		data[`[${name}]`]["activityBar.background"]        = "#000000b3";
		data[`[${name}]`]["editor.background"]             = "#1111114d";
		data[`[${name}]`]["quickInput.background"]         = "#FFFFFFe6";
		data[`[${name}]`]["sideBar.background"]            = "#FFF";

		assert.deepStrictEqual(new WorkbenchSetting().get("colorCustomizations"), data);

		fsStub.restore();
	}).timeout(30 * 1000);
});
