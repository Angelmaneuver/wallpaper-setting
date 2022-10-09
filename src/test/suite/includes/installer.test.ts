import * as assert          from "assert";
import * as sinon           from "sinon";
import { env }              from "vscode";
import * as testTarget      from "../../../includes/installer";
import { InstallManager }   from "../../../includes/installer";
import { ExtensionSetting } from "../../../includes/settings/extension";

suite('Installer Test Suite', async () => {
	test('getInstance', async () => {
		assert(testTarget.getInstance(new ExtensionSetting()) instanceof InstallManager);
	});

	test('getInstance - Entry Point Acquisition Error', async () => {
		const stub = sinon.stub(env, "appRoot").throws();

		try {
			testTarget.getInstance(new ExtensionSetting());
		} catch (e) {
			assert(e instanceof URIError);
		}

		stub.restore();
	});
});
