import * as assert          from "assert";
import * as sinon           from "sinon";
import * as path            from "path";
import * as testTarget      from "../../../includes/guide/begin";
import { ExtensionContext } from "vscode";
import { MultiStepInput }   from "../../../includes/utils/multiStepInput";
import { State }            from "../../../includes/guide/base/base";
import { ExtensionSetting } from "../../../includes/settings/extension";
import { VSCodePreset }     from "../../../includes/utils/base/vscodePreset";
import * as Convert         from "../../../includes/convert";

suite('Scenario - Optimze With Advanced Mode Test Suite', async () => {
	const stateCreater  = () => ({ title: "Test Suite", resultSet: {} } as State);
	const items         = {
		Optimize:     VSCodePreset.create(VSCodePreset.Icons.desktopDownload, "Optimize",    "Optimize the color theme you are using."),
	};

	test('Begin -> Optimze -> Base Opacity -> Overlap Opacity -> Selection Opacity -> Json', async () => {
		const themeName     = "test theme";
		const filePath      = path.join(__dirname, "testDir", "test.json");
		const base          = "0.1";
		const overlap       = "0.2";
		const selection     = "0.3";
		const inputStub     = sinon.stub(MultiStepInput.prototype,        "showInputBox");
		const pickStub      = sinon.stub(MultiStepInput.prototype,        "showQuickPick");
		const convertStub   = sinon.stub(Convert,                         "theme2transparancy");
		const context       = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;

		await new ExtensionSetting().set(ExtensionSetting.propertyIds.advancedMode, true);

		pickStub.resolves(items.Optimize);
		inputStub.onCall(0).resolves(themeName);
		inputStub.onCall(1).resolves("");
		inputStub.onCall(2).resolves("");
		inputStub.onCall(3).resolves("");
		inputStub.onCall(4).resolves(filePath);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(stateCreater(), context).start(input));

		assert.strictEqual(convertStub.getCall(0).args[0], themeName);
		assert.strictEqual(convertStub.getCall(0).args[1], filePath);
		assert.notStrictEqual(convertStub.getCall(0).args[2], { base: "0.75", overlap: "0.75", selection: "0.75" });

		assert.strictEqual(pickStub.calledOnce,    true);
		assert.strictEqual(convertStub.calledOnce, true);

		inputStub.reset();
		pickStub.reset();
		convertStub.reset();

		pickStub.resolves(items.Optimize);
		inputStub.onCall(0).resolves(themeName);
		inputStub.onCall(1).resolves(base);
		inputStub.onCall(2).resolves(overlap);
		inputStub.onCall(3).resolves(selection);
		inputStub.onCall(4).resolves(filePath);
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(stateCreater(), context).start(input));

		assert.strictEqual(convertStub.getCall(0).args[0], themeName);
		assert.strictEqual(convertStub.getCall(0).args[1], filePath);
		assert.notStrictEqual(convertStub.getCall(0).args[2], { base: base, overlap: overlap, selection: selection });

		assert.strictEqual(pickStub.calledOnce,    true);
		assert.strictEqual(convertStub.calledOnce, true);

		inputStub.restore();
		pickStub.restore();
		convertStub.restore();

		await new ExtensionSetting().uninstall();
	}).timeout(30 * 1000);
});
