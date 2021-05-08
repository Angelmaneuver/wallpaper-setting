import * as assert          from "assert";
import * as sinon           from "sinon";
import * as vscode          from "vscode";
import * as testTarget      from "../../../includes/guidance";
import { MultiStepInput }   from "../../../includes/utils/multiStepInput";
import { State }            from "../../../includes/guide/base/base";
import { GuideFactory }     from "../../../includes/guide/factory/base";
import { StartMenuGuide }   from "../../../includes/guide/begin";

suite('Guidance Test Suite', async () => {
	test('guidance', async () => {
		const multiStepInputStub = sinon.stub(MultiStepInput,           "run");
		const guideFactoryStub   = sinon.stub(GuideFactory,             "create");
		const menuGuideStub      = sinon.stub(StartMenuGuide.prototype, "start");
		const windowMock         = sinon.mock(vscode.window);
		const commandMock        = sinon.mock(vscode.commands);
		const context            = {} as vscode.ExtensionContext;

		multiStepInputStub.onFirstCall().throws(new Error("Stub Error"));
		windowMock.expects("showWarningMessage").withArgs("Stub Error").once();
		await testTarget.guidance(context);

		guideFactoryStub.onSecondCall().callsFake(
			(className: string, state: State, context: vscode.ExtensionContext) => {
				state.message = "Stub Info";
				return new StartMenuGuide(state, context);
			}
		);
		windowMock.expects("showInformationMessage").withArgs("Stub Info").once();
		await testTarget.guidance(context);

		guideFactoryStub.onThirdCall().callsFake(
			(className: string, state: State, context: vscode.ExtensionContext) => {
				state.reload = true;
				return new StartMenuGuide(state, context);
			}
		);
		commandMock.expects("executeCommand").once().withArgs("workbench.action.reloadWindow");
		await testTarget.guidance(context);

		windowMock.verify();
		commandMock.verify();

		guideFactoryStub.restore();
		multiStepInputStub.restore();
		windowMock.restore();
		commandMock.restore();

		await testTarget.guidance(context);
		assert.strictEqual(menuGuideStub.calledOnce, true);
		menuGuideStub.restore();
	});
});
