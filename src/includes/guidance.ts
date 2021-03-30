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
	let   title                 = "Wallpaper Setting";
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
		Setting: {
			Menu: VSCodePreset.create(
				VSCodePreset.Icons.settingsGear,
				"Setting",
				"Set Parameters individually."
			),
			SubMenu: {
				Image: VSCodePreset.create(
					VSCodePreset.Icons.fileMedia,
					"Image Path",
					"Set the image to be used as the wallpaper."
				),
				Slide: VSCodePreset.create(
					VSCodePreset.Icons.folder,
					"Image Files Path",
					"Set the images to be used as the slide."
				),
				Opacity: VSCodePreset.create(
					VSCodePreset.Icons.eye,
					"Opacity",
					"Set the opacity of the wallpaper."

				),
				Clock: VSCodePreset.create(
					VSCodePreset.Icons.clock,
					"Slide Interval",
					"Set the slide interval."
				),
				Unit: VSCodePreset.create(
					VSCodePreset.Icons.law,
					"Slide Interval's Unit",
					"Set the slide interval's unit."
				),
				Exit: VSCodePreset.create(
					VSCodePreset.Icons.signOut,
					"Exit",
					"Exit without saving any changes."
				)
			},
			SubMenuOption: {
				Save: VSCodePreset.create(
					VSCodePreset.Icons.save,
					"Save",
					"Save changes."
				),
			},
		},
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
		title:               string;
		step:                number;
		totalSteps:          number;
		activeParameter:     QuickPickItem;
		imagePath:           string         | undefined;
		directoryPath:       string         | undefined;
		opacity:             string         | undefined;
		intervalUnit:        QuickPickItem;
		interval:            string         | undefined;
		editedImagePath:     boolean        | undefined;
		editedDirectoryPath: boolean        | undefined;
		editedOpacity:       boolean        | undefined;
		editedIntervalUnit:  boolean        | undefined;
		editedInterval:      boolean        | undefined;
		reload:              boolean        | undefined;
		exit:                boolean        | undefined;
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

	async function selectProcess(): Promise<void> {
		const installed: boolean  = installer.isInstall();
		const ready: {} | boolean = installer.isReady();
		const state               = {} as Partial<State>
		let   selection           = await window.showQuickPick(
			new Array()
				.concat(!installed && ready ? [processes.Set] : [])
				.concat(installed
					? [processes.Reset, processes.Crear]
					: []
				)
				.concat(ready
					? [processes.Setting.Menu]
					: []
				)
				.concat(processes.Setup, processes.SetUpAsSlide, processes.Uninstall)
		);

		switch (selection) {
			case processes.Set:
			case processes.Reset:
				await selectSetMode(state);
				break;
			case processes.Crear:
				installer.uninstall();
				state.reload = true;
				break;
			case processes.Setting.Menu:
				await settingParameter(state);
				break;
			case processes.Setup:
				installStyle = installType.Image;
				await wallpaperSetupInputs(state);
				await setImageFilePath(state.imagePath);
				await setOpacity(state.opacity);
				installer.install();
				state.reload = true;
				break;
			case processes.SetUpAsSlide:
				installStyle = installType.Slide;
				await wallpaperSetupInputs(state);
				await setSlideFilePaths(state.directoryPath);
				await setOpacity(state.opacity);
				await setSlideInterval(state.interval);
				await setSlideIntervalUnit(state.intervalUnit);
				installer.installAsSlide();
				state.reload = true;
				break;
			case processes.Uninstall:
				installer.uninstall();
				await settings.uninstall();
				state.reload = true;
				break;
			default:
				break;
		}

		if (state.reload) {
			reload();
		}
	}

	async function selectSetMode(state: Partial<State>): Promise<void> {
		const ready  = installer.isReady();
		state.reload = false;

		if (ready && !(typeof(ready) === "boolean")) {
			if (ready.image && !ready.slide) {
				installer.install();
				state.reload   = true;
			} else if (!ready.image && ready.slide) {
				installer.installAsSlide();
				state.reload   = true;
			} else if (ready.image && ready.slide) {
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
							state.reload = true;
							break;
						case items[1]:
							installer.installAsSlide();
							state.reload = true;
							break;
					}
				}
			}
		}
	}

	async function settingParameter(state: Partial<State>): Promise<void> {
		title              += " - Parameters";
		totalSteps         = 0;
		state.imagePath    = settings.filePath;
		state.opacity      = settings.opacity.toString();
		state.interval     = settings.slideInterval.toString();
		state.intervalUnit = intervalUnits.filter(
			(value) => {
				return value.label === settings.slideIntervalUnit;
			}
		)[0];
		state.exit         = false;

		do {
			await MultiStepInput.run((input) => selectSettingParameter(input, state));
		} while (!state.exit);
	}

	async function selectSettingParameter(
		input: MultiStepInput,
		state: Partial<State>
	) {
		let items             = Object.entries(processes.Setting.SubMenu).map(([key, value]) => (value))
			.concat(
				isEdited(state)
				? [processes.Setting.SubMenuOption.Save]
				: []
			);

		state.activeParameter = await input.showQuickPick(
			{
				title:        title,
				step:         0,
				totalSteps:   totalSteps,
				placeholder:  "Select the item you want to set.",
				items:        items,
				activeItem:   state.activeParameter,
				validate:     () => undefined,
				shouldResume: shouldResume,
			}
		);

		switch (state.activeParameter) {
			case processes.Setting.SubMenu.Image:
				installStyle = installType.Image;
				return (input: MultiStepInput) => inputResorucePath(input, state);
			case processes.Setting.SubMenu.Slide:
				installStyle = installType.Slide;
				return (input: MultiStepInput) => inputResorucePath(input, state);
			case processes.Setting.SubMenu.Opacity:
				return (input: MultiStepInput) => inputOpacity(input, state);
			case processes.Setting.SubMenu.Clock:
				return (input: MultiStepInput) => inputInterval(input, state);
			case processes.Setting.SubMenu.Unit:
				return (input: MultiStepInput) => inputIntervalUnit(input, state);
			case processes.Setting.SubMenu.Exit:
				state.exit   = true;
				break;
			case processes.Setting.SubMenuOption.Save:
				if (state.editedImagePath) {
					await setImageFilePath(state.imagePath);
				}

				if (state.editedDirectoryPath) {
					await setSlideFilePaths(state.directoryPath);
				}

				if (state.editedOpacity) {
					await setOpacity(state.opacity);
				}

				if (state.editedInterval) {
					await setSlideInterval(state.interval);
				}

				if (state.editedIntervalUnit) {
					await setSlideIntervalUnit(state.intervalUnit);
				}

				state.exit   = true;
				await selectSetMode(state);
				break;
			default:
				break;
		};
	}

	async function wallpaperSetupInputs(state: Partial<State>) {
		title      += installStyle === installType.Image
			? " - Image"
			: " - Slide";
		totalSteps = installStyle === installType.Image ? 2 : 4;
		await MultiStepInput.run((input) => inputResorucePath(input, state));
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
					step:         totalSteps ? 1 : 0,
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
			state.imagePath           = targetPath;
			state.editedImagePath     = true;
		} else {
			state.directoryPath       = targetPath;
			state.editedDirectoryPath = true;
		}

		if (totalSteps) {
			return (input: MultiStepInput) => inputOpacity(input, state);
		}
	}

	async function inputOpacity(input: MultiStepInput, state: Partial<State>) {
		state.opacity       = await input.showInputBox(
			{
				title:          title,
				step:           totalSteps ? 2 : 0,
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

		state.editedOpacity = true;

		if (installStyle === installType.Slide) {
			return (input: MultiStepInput) => inputIntervalUnit(input, state);
		}
	}

	async function inputIntervalUnit(
		input: MultiStepInput,
		state: Partial<State>
	) {
		state.intervalUnit       = await input.showQuickPick(
			{
				title:        title,
				step:         totalSteps ? 3 : 0,
				totalSteps:   totalSteps,
				placeholder:  "Select the unit of slide interval to enter next.",
				items:        intervalUnits,
				activeItem:   state.intervalUnit,
				validate:     () => undefined,
				shouldResume: shouldResume,
			}
		);

		state.editedIntervalUnit = true;

		if (totalSteps) {
			return (input: MultiStepInput) => inputInterval(input, state);
		}
	}

	async function inputInterval(input: MultiStepInput, state: Partial<State>) {
		state.interval       = await input.showInputBox(
			{
				title:          title,
				step:           totalSteps ? 4 : 0,
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

		state.editedInterval = true;
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

	async function setImageFilePath(imageFilePath: string | undefined): Promise<void> {
		if (imageFilePath) {
			await settings.set("filePath", imageFilePath);
		}
	}

	async function setSlideFilePaths(directoryPath: string | undefined): Promise<void> {
		if (directoryPath) {
			await settings.set(
				"slideFilePaths",
				File.getChldrens(
					directoryPath,
					{
						filters:   applyImages,
						fullPath:  true,
						recursive: false,
					}
				)
			);
		}
	}

	async function setOpacity(opacity: string | undefined): Promise<void> {
		if (opacity) {
			await settings.set("opacity", Number(opacity));
		}
	}

	async function setSlideInterval(slideInterval: string | undefined): Promise<void> {
		if (slideInterval) {
			await settings.set("slideInterval", Number(slideInterval));
		}
	}

	async function setSlideIntervalUnit(slideIntervalUnit: QuickPickItem | undefined): Promise<void> {
		if (slideIntervalUnit) {
			await settings.set("slideIntervalUnit", slideIntervalUnit.label);
		}
	}

	function isEdited(state: Partial<State>): boolean {
		return (
			state.editedImagePath     ||
			state.editedDirectoryPath ||
			state.editedOpacity       ||
			state.editedInterval      ||
			state.editedIntervalUnit
			? true
			: false
		);
	}

	function reload(): void {
		commands.executeCommand("workbench.action.reloadWindow");
	}

	await selectProcess();
}
