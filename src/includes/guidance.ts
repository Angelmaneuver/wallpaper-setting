import * as path            from "path";
import {
	window,
	commands,
	ExtensionContext,
	QuickInputButton,
	QuickPickItem,
	Uri,
} from "vscode";
import { Wallpaper }        from "./wallpaper";
import { ExtensionSetting } from "./settings/extension";
import { VSCodePreset }     from "./utils/base/vscodePreset";
import { File }             from "./utils/base/file";
import { MultiStepInput }   from "./utils/multiStepInput";
import { Selecter }         from "./utils/selecter";

export async function guidance(context: ExtensionContext) {
	const title                 = "Wallpaper Setting";
	let   totalSteps            = 0;
	let   installStyle: number;
	const minimumOpacity        = 1;
	const maximumOpacity        = 0.5;
	const minimumInterval       = 0.1;
	const intervalUnits         = [
		"Hour",
		"Minute",
		"Second",
		"MilliSecond",
	].map((label) => ({ label }));
	const applyImages           = ["png", "jpg", "jpeg", "gif"];
	const installType           = { Image: 0, Slide: 1 };
	const processes             = {
		Set: VSCodePreset.create(
			VSCodePreset.Icons.debugStart,
			"Set",
			"Set wallpaper with current settings."
		),
		Reset: VSCodePreset.create(
			VSCodePreset.Icons.debugRerun,
			"Reset",
			"Reset wallpaper with current settings."
		),
		Crear: VSCodePreset.create(
			VSCodePreset.Icons.debugStop,
			"Clear",
			"Erase the wallpaper."
		),
		Setup: VSCodePreset.create(
			VSCodePreset.Icons.fileMedia,
			"Setup Image",
			"Set an image to wallpaper."
		),
		SetUpAsSlide: VSCodePreset.create(
			VSCodePreset.Icons.folder,
			"Setup Slide",
			"Set an image slide to wallpaper."
		),
		Uninstall: VSCodePreset.create(
			VSCodePreset.Icons.trashcan,
			"Uninstall",
			"Remove all parameters for this extension."
		),
	};
	const settings              = new ExtensionSetting();
	const installLocation       = () => {
		let result: string | undefined;

		if (require.main?.filename) {
			result = require.main?.filename;
			console.debug('Use "require.main?.filename"');
		} else {
			result = process.mainModule?.filename;
			console.debug('Use "process.mainModule?.filename"');
		}

		return result ? path.dirname(result) : "";
	};
	const installer             = new Wallpaper(
		installLocation(),
		"bootstrap-window.js",
		settings,
		"wallpaper-setting"
	);

	interface State {
		title:         string;
		step:          number;
		totalSteps:    number;
		imagePath:     string | undefined;
		directoryPath: string | undefined;
		opacity:       string | undefined;
		intervalUnit:  QuickPickItem;
		interval:      string | undefined;
	}

	class GuidanceButton implements QuickInputButton {
		constructor(
			public iconPath: { light: Uri; dark: Uri },
			public tooltip:  string
		) {}
	}

	const openDialogButton      = new GuidanceButton(
		{
			dark:  Uri.file(context.asAbsolutePath("resource/light/folder.svg")),
			light: Uri.file(context.asAbsolutePath("resource/light/folder.svg")),
		},
		"Open the file dialog."
	);

	async function selectProcess() {
		const installed: boolean = installer.isInstall();
		const ready: boolean     = installer.isReady();

		let selection            = await window.showQuickPick(
			new Array()
				.concat(!installed && ready ? [processes.Set]                    : [])
				.concat(installed           ? [processes.Reset, processes.Crear] : [])
				.concat(processes.Setup, processes.SetUpAsSlide, processes.Uninstall)
		);

		let execute: boolean     = true;
		let state;

		switch (selection) {
			case processes.Set:
				execute      = await selectSetMode();
				break;
			case processes.Reset:
				execute      = await selectSetMode();
				break;
			case processes.Crear:
				installer.uninstall();
				break;
			case processes.Setup:
				installStyle = installType.Image;
				state        = await wallpaperSetupInputs();
				await settings.set("filePath", state.imagePath);
				if (state.opacity) {
					await settings.set("opacity", Number(state.opacity));
				}
				installer.install();
				break;
			case processes.SetUpAsSlide:
				installStyle = installType.Slide;
				state        = await wallpaperSetupInputs();
				await settings.set(
					"slideFilePaths",
					File.getChldrens(
						state.directoryPath ? state.directoryPath : "",
						{
							filters:   applyImages,
							fullPath:  true,
							recursive: false,
						}
					)
				);
				if (state.opacity) {
					await settings.set("opacity", Number(state.opacity));
				}
				if (state.interval) {
					await settings.set("slideInterval", Number(state.interval));
				}
				await settings.set("slideIntervalUnit", state.intervalUnit.label);
				installer.installAsSlide();
				break;
			case processes.Uninstall:
				installer.uninstall();
				await settings.uninstall();
				break;
			default:
				execute      = false;
		}

		if (execute) {
			reload();
		}
	}

	async function selectSetMode(): Promise<boolean> {
		let execute: boolean = true;

		if (settings.filePath && !(settings.slideFilePaths.length > 0)) {
			installer.install();
		} else if (!settings.filePath && settings.slideFilePaths.length > 0) {
			installer.installAsSlide();
		} else {
			let items      = [processes.Setup, processes.SetUpAsSlide];
			items[0].label = items[0].label.replace("Setup ", "");
			items[1].label = items[1].label.replace("Setup ", "");

			let selection  = await window.showQuickPick(items, {
				placeHolder: "Select the type of wallpaper you want to set.",
			});

			if (selection) {
				switch (selection) {
					case items[0]:
						installer.install();
						break;
					case items[1]:
						installer.installAsSlide();
						break;
				}
			} else {
				execute = false;
			}
		}

		return execute;
	}

	async function wallpaperSetupInputs() {
		const state = {} as Partial<State>;
		totalSteps  = installStyle === installType.Image ? 2 : 4;
		await MultiStepInput.run((input) => inputResorucePath(input, state));

		return state as State;
	}

	async function inputResorucePath(
		input: MultiStepInput,
		state: Partial<State>
	) {
		const prompt   =
			installStyle === installType.Image
				? "Enter the path of the image file you want to set as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right."
				: "Enter the path of the folder that contains the image files you want to use for the slides, or select it from the dialog box that appears when you click the button in the upper right corner.";
		let value: string | undefined;
		let targetPath = undefined;

		if (installStyle === installType.Image) {
			value = state.imagePath;
		} else {
			value = state.directoryPath;
		}

		do {
			const result = await input.showInputBox(
				{
					title:        title,
					step:         1,
					totalSteps:   totalSteps,
					buttons:      [openDialogButton],
					value:        typeof value === "string" ? value : "",
					prompt:       prompt,
					validate:
						installStyle === installType.Image
							? validateFileExist
							: validateDirectoryExist,
					shouldResume: shouldResume,
				}
			);

			if (result instanceof GuidanceButton) {
				const options   =
					installStyle === installType.Image
						? { filters: { Images: applyImages } }
						: {
								canSelectFolders: true,
								canSelectFiles: false,
						  };

				const selection = await new Selecter(options).openFileDialog();

				if (selection && selection.path) {
					targetPath = selection.path;
				}
			} else {
				targetPath = result;
			}
		} while (!targetPath);

		if (installStyle === installType.Image) {
			state.imagePath     = targetPath;
		} else {
			state.directoryPath = targetPath;
		}

		return (input: MultiStepInput) => inputOpacity(input, state);
	}

	async function inputOpacity(input: MultiStepInput, state: Partial<State>) {
		state.opacity = await input.showInputBox(
			{
				title:          title,
				step:           2,
				totalSteps:     totalSteps,
				ignoreFocusOut: true,
				value:          typeof state.opacity === "string" ? state.opacity : "",
				prompt:
					"Enter a number between " +
					maximumOpacity +
					" and 1 for opacity. (current opacity:" +
					settings.opacity +
					")",
				validate:       validateOpacity,
				shouldResume:   shouldResume,
			}
		);

		if (installStyle === installType.Slide) {
			return (input: MultiStepInput) => inputIntervalUnit(input, state);
		}
	}

	async function inputIntervalUnit(
		input: MultiStepInput,
		state: Partial<State>
	) {
		state.intervalUnit = await input.showQuickPick(
			{
				title:        title,
				step:         3,
				totalSteps:   totalSteps,
				placeholder:  "Select the unit of slide interval to enter next.",
				items:        intervalUnits,
				activeItem:   state.intervalUnit,
				validate:     () => undefined,
				shouldResume: shouldResume,
			}
		);

		return (input: MultiStepInput) => inputInterval(input, state);
	}

	async function inputInterval(input: MultiStepInput, state: Partial<State>) {
		state.interval = await input.showInputBox(
			{
				title:          title,
				step:           4,
				totalSteps:     totalSteps,
				ignoreFocusOut: true,
				value: typeof   state.interval === "string" ? state.interval : "",
				prompt:
					"Enter a number between 0.1 and 65555 in " +
					state.intervalUnit?.label +
					". (current interval: " +
					settings.slideInterval +
					settings.slideIntervalUnit +
					")",
				validate:       validateInterval,
				shouldResume:   shouldResume,
			}
		);
	}

	async function validateFileExist(filePath: string): Promise<string | undefined>
	{
		if (!File.isFile(filePath, applyImages)) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve("Invalid path.");
				}
			);
		} else {
			return undefined;
		}
	}

	async function validateDirectoryExist(filePath: string): Promise<string | undefined>
	{
		if (!File.isDirectory(filePath)) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve("Invalid path.");
				}
			);
		} else {
			return undefined;
		}
	}

	async function validateOpacity(opacity: string): Promise<string | undefined> {
		return await validateNumber("opacity", opacity, {
			minimum: maximumOpacity,
			maximum: minimumOpacity,
		});
	}

	async function validateInterval(interval: string): Promise<string | undefined> {
		return await validateNumber("interval", interval, {
			minimum: minimumInterval,
		});
	}

	async function validateNumber(
		name:     string,
		value:    string,
		options?: {
			minimum?: number;
			maximum?: number;
		}
	): Promise<string | undefined> {
		let minimum: number = 0;
		let maximum: number = 65555;

		if (options) {
			minimum = options.minimum ? options.minimum : minimum;
			maximum = options.maximum ? options.maximum : maximum;
		}

		let string2Number   = Number(value);

		if (!value || (string2Number >= minimum && string2Number <= maximum)) {
			return undefined;
		} else if (
			isNaN(string2Number) ||
			string2Number > maximum ||
			string2Number < minimum
		) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve(
						"Enter a number between " +
							minimum +
							" and " +
							maximum +
							" for " +
							name +
							"."
					);
				}
			);
		} else {
			return undefined;
		}
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {
			// noop
		});
	}

	function reload(): void {
		commands.executeCommand("workbench.action.reloadWindow");
	}

	await selectProcess();
}
