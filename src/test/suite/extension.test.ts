import * as assert        from "assert";
import * as sinon         from "sinon";
import * as vscode        from "vscode";
import * as testTarget    from "../../extension";
import * as Guidance      from "../../includes/guidance";
import * as Favorite      from "../../includes/favorite";

suite('Extension Test Suite', async () => {
	const extensionId       = 'angelmaneuver.wallpaper-setting';
	const extenisonCommands = ['wallpaper-setting.guidance'];

	test('Present', () => {
		assert.ok(vscode.extensions.getExtension(extensionId))
	});

    test('Activate', async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		await vscode.extensions.getExtension(extensionId)?.activate().then((api) => { assert.ok(true); });
	});

	test('Register Commands', async () => {
		return vscode.commands.getCommands(true).then((commands) => {
			for (const extensionCommand of extenisonCommands) {
				if (!commands.includes(extensionCommand)) {
					assert.fail();
				}
			}
		})
	});

	test('Execute Commands', async () => {
		const guidanceStub = sinon.stub(Guidance, "guidance");
		const favoriteStub = sinon.stub(Favorite, "randomSet");
		await vscode.commands.executeCommand(extenisonCommands[0]);
		guidanceStub.restore();
		favoriteStub.restore();
	});

    test('DeActivate', async () => {
		testTarget.deactivate();
		assert.ok(true);
	});
});
