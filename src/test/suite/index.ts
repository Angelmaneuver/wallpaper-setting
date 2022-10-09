/* eslint @typescript-eslint/no-var-requires: "off" */
import * as path  from 'path';
import * as Mocha from 'mocha';
import * as glob  from 'glob';
import                 'ts-node/register';
import                 'source-map-support/register';

const NYC        = require('nyc');
const baseConfig = require('@istanbuljs/nyc-config-typescript');

function getNycInstance(): typeof NYC {
	const nyc = new NYC({
		...baseConfig,
		cwd: path.join(__dirname, '..', '..', '..' ),
		reporter: ['text-summary', 'lcov', 'html'],
		all: true,
		silent: false,
		instrument: true,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
		sourceMap: true,
		include: ['src/**/*.ts', 'out/**/*.js'],
		exclude: ['**/test/*'],
	});

	nyc.reset();
	nyc.wrap();

	return nyc;
}

export async function run(): Promise<void> {
	const testsRoot = path.resolve(__dirname, '..');

	// Sets the test coverage
	const nyc = '1' === process.env['COVERAGE'] ? getNycInstance() : undefined;

	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	// Backup of settings.json and clear
	/**
	const { ExtensionSetting } = require('../../includes/settings/extension');
	const { WorkbenchSetting } = require('../../includes/settings/workbench');
	const backup               = new ExtensionSetting();
	const backup4workbench     = new WorkbenchSetting();

	await new ExtensionSetting().uninstall();
	await new WorkbenchSetting().uninstall();
	 */

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
					/**
					await backup.batchInstall();
					await backup4workbench.install();
					 */

					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						if (nyc) {
							nyc.writeCoverageFile();
							await nyc.report();
						}

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
