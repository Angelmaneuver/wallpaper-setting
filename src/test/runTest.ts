import * as path from 'path';

import { runTests }               from '@vscode/test-electron';
// import { downloadAndUnzipVSCode } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		// const vscodeExecutablePath = await downloadAndUnzipVSCode();

		// signal that the coverage data should be gathered
		process.env['COVERAGE'] = process.argv.indexOf('--coverage') >= 0 ? '1' : '0';

		await runTests({
			// vscodeExecutablePath:     vscodeExecutablePath,
			extensionDevelopmentPath: extensionDevelopmentPath,
			extensionTestsPath:       extensionTestsPath,
		});
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
