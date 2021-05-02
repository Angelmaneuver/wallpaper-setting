import * as assert          from "assert";
import * as sinon           from "sinon";
import * as testTarget      from "../../../includes/installer";
import { Wallpaper }        from "../../../includes/wallpaper";
import { ExtensionSetting } from "../../../includes/settings/extension";
import { Optional }         from "../../../includes/utils/base/optional";

suite('Installer Test Suite', async () => {
	test('getInstance', async () => {
		assert(testTarget.getInstance(new ExtensionSetting()) instanceof Wallpaper);
	});

	test('getInstance - Entry Point Acquisition Error', async () => {
		const stub = sinon.stub(new Optional(require.main?.filename), "orElseThrow");
		stub.throws();

		try {
			testTarget.getInstance(new ExtensionSetting());
		} catch (e) {
			assert(e instanceof URIError);
		}

		stub.restore();
	});
});
