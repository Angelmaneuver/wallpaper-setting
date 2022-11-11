import * as assert          from "assert";
import * as sinon           from "sinon";
import * as path            from "path";
import * as testTarget      from "../../../includes/guide/begin";
import { ExtensionContext } from "vscode";
import { MultiStepInput }   from "../../../includes/utils/multiStepInput";
import { State }            from "../../../includes/guide/base/base";
import { VSCodePreset }     from "../../../includes/utils/base/vscodePreset";
import { ProcessExplorer }  from "../../../includes/wallpaper/processExplorer";

suite('Scenario - Process Explorer Test Suite', async () => {
	const stateCreater  = () => ({ title: "Test Suite", resultSet: {} } as State);
	const items         = {
		ProcessExplorer: VSCodePreset.create(VSCodePreset.Icons.window,          "Process Explorer", "Set an background color of the Process Explorer."),
	};

	test('Begin -> Process Explorer', async () => {
		const inputStub       = sinon.stub(MultiStepInput.prototype,        "showInputBox");
		const pickStub        = sinon.stub(MultiStepInput.prototype,        "showQuickPick");
		const peInstallStub   = sinon.stub(ProcessExplorer.prototype,       "install");
		const peUninstallStub = sinon.stub(ProcessExplorer.prototype,       "uninstall");
		const peIsInstallStub = sinon.stub(ProcessExplorer.prototype,       "isInstall");
		const context         = { asAbsolutePath: (dir: string) => path.join(__dirname, "..", "..", "..", "..", "..", dir) } as ExtensionContext;

		peIsInstallStub.value(false);
		pickStub.onFirstCall().resolves(items.ProcessExplorer);
		inputStub.onFirstCall().resolves('#000000');
		pickStub.onSecondCall().resolves({ label: "$(check) Yes", description: "" });
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(stateCreater(), context).start(input));

		assert.strictEqual(pickStub.calledTwice,     true);
		assert.strictEqual(inputStub.calledOnce,     true);
		assert.strictEqual(peInstallStub.calledOnce, true);

		inputStub.reset();
		pickStub.reset();
		peIsInstallStub.reset();

		peIsInstallStub.value(true);
		pickStub.onFirstCall().resolves(items.ProcessExplorer);
		pickStub.onSecondCall().resolves({ label: "$(check) Yes", description: "" });
		await MultiStepInput.run((input: MultiStepInput) => new testTarget.StartMenuGuide(stateCreater(), context).start(input));

		assert.strictEqual(pickStub.calledTwice,       true);
		assert.strictEqual(peUninstallStub.calledOnce, true);

		inputStub.restore();
		pickStub.restore();
		peInstallStub.restore();
		peUninstallStub.restore();
		peIsInstallStub.restore();
	}).timeout(30 * 1000);
});
