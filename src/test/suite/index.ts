import * as path            from 'path';
import * as Mocha           from 'mocha';
import * as glob            from 'glob';
import { ExtensionSetting } from '../../includes/settings/extension';

export async function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');
	const backup    = new ExtensionSetting();

	await new ExtensionSetting().uninstall();

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, async (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(async failures => {
					await backup.batchInstall();

					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}
