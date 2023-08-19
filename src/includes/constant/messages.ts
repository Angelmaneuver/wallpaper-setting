import { l10n }   from "vscode";
import { values } from "./values";

const backToPrevious  = l10n.t("Back to previous.");

export const messages = {
	placeholder: {
		begin:   l10n.t("Select the item you want to do."),
		image:   l10n.t("Enter the path of the image file you want to set as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right."),
		slide: {
			filePaths:        l10n.t("Enter the path of the folder that contains the image files you want to use for the slides, or select it from the dialog box that appears when you click the button in the upper right corner."),
			interval:         {
				time: (min: number, unit: string) => l10n.t("Enter a number between {0} and 65555 in {1}. (Default: 25)", min, unit),
				unit: l10n.t("Select the unit of slide interval to enter next."),
			},
			randomPlay:       l10n.t("Do you want to randomize the sliding order of images ?"),
			effectFadeIn:     l10n.t("Do you want to fade in effect when the slide image changes ?"),
			loadWaitComplete: l10n.t("Do you want to wait for image loading ?"),
			select:           l10n.t("Select the item you want to set."),
		},
		opacity: (min: number, max: number) => l10n.t("Enter a number between {0} and {1} for opacity. (Default: 0.75)", max, min),
		wallpaper: l10n.t("Select the type of wallpaper you want to set."),
		favorite: {
			select: {
				process: l10n.t("Select the process you want to perform."),
				operation: {
					register: l10n.t("Select the type of wallpaper you want to register for favorite."),
					open:     l10n.t("Select the type of wallpaper you want to Open."),
				},
			},
			register: {
				message: l10n.t("Enter the name of the favorite setting to be registered."),
				override: {
					confirm: {
						message: l10n.t("There is a favorite setting with the same name, do you want to overwrite it ?"),
						yes:     l10n.t("Overwrite."),
						no:      backToPrevious,
					}
				}
			},
			open:          l10n.t("Select the favorite."),
			selectExecute: l10n.t("Select what you want to execute with this favorite."),
			delete: {
				confirm: {
					message: l10n.t("Do you want to unregister it ?"),
					yes:     l10n.t("UnRegister."),
					no:      backToPrevious,
				},
			},
			randomSet: {
				message: l10n.t("Do you want to set a random wallpaper from your favorite settings at start up ?"),
				filter:  l10n.t("Select the favorite type you want to set as random."),
			},
		},
		optimize: {
			theme:     l10n.t("Please enter the name of the color theme you are using."),
			json:      l10n.t("Enter the path of the color theme json file, or select it from the file dialog that appears by clicking the button on the upper right."),
			basic:     l10n.t("Enter the opacity to be applied to the basic areas."),
			overlap:   l10n.t("Enter the opacity to be applied to the overlapping areas."),
			selection: l10n.t("Enter the opacity to be applied to the selection areas. * A higt opacity is recommended."),
		},
		processExplorer: {
			add: {
				colorCode: l10n.t("Please enter the color code you want to set for the background color."),
				confirm: {
					message: l10n.t("Add a background color to the Process Explorer ?"),
					yes:     l10n.t("Add."),
					no:      backToPrevious,
				},
			},
			remove: {
				confirm: {
					message: l10n.t("Remove a background color to the Process Explorer ?"),
					yes:     l10n.t("Remove."),
					no:      backToPrevious,
				},
			}
		},
		sync: {
			select: {
				process: l10n.t("Select the process you want to perform."),
			},
			upload: {
				filePath: l10n.t("Enter the path of the image file you want to sync as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right."),
				password: l10n.t("Enter the password used to encrypt the image data."),
				salt:     l10n.t("Please note the displayed salt or enter the salt."),
			},
			download: {
				password: l10n.t("Enter the password used to decrypt the image data."),
				salt:     l10n.t("Enter the salt used to decrypt the image data."),
			},
			delete: l10n.t("Do you want to delete your wallpaper settings from Settings Sync ?"),
		},
		uninstall: {
			confirm: {
				message: l10n.t("Do you want to uninstall the wallpaper and erase all settings related to this extension ?"),
				yes:     l10n.t("Uninstall."),
				no:      backToPrevious,
			},
		},
	},
	validate: {
		required:     l10n.t("Required field."),
		invalidValue: l10n.t("Invalid value."),
		number: {
			between: (min: number, max: number, name: string) => l10n.t("Enter a number between {0} and {1} for {2}.", min, max, name),
		},
		file: {
			invalid: l10n.t("Invalid path."),
		},
		sync: {
			size: l10n.t("The image file size that can be sync is less than {0}.", values.sync.limit.display),
		},
	},
	showInformationMessage: {
		restart:         l10n.t("VSCode must be restarted for the settings to take effect. Would you like to close this window and open a new one ?"),
		favorite:        {
			register: (name: string) => l10n.t("Registered {0} to favorites !", name),
			selectExecute: {
				newWindow: l10n.t("After confirming that a new window has been lunched, please click 'OK' or close this message. * Restore the wallpaper settings."),
				ok:        l10n.t("OK"),
			},
			delete: (name: string) => l10n.t("UnRegistered {0} from favorites !", name),
		},
		optimize: {
			success: l10n.t("Optimized color information for color theme."),
			error:   (e: Error) => l10n.t("json file could' not be parsed successfully. \"{0}\".", e),
		},
		processExplorer: {
			add:    l10n.t("Added the background color to Process Explorer."),
			remove: l10n.t("Removed the background color from Process Explorer."),
		},
		sync: {
			success: {
				upload:   l10n.t("Wallpaper settings uploaded !"),
				delete:   l10n.t("Removed wallpaper settings from Settings Sync."),
			},
			warning: {
				download: l10n.t("The decryption result was not in the expected format. Please check password and salt."),
			},
		},
		error: {
			permission: (filePath: string) => l10n.t("You don't have write permission to the file required to run this extension. Please check the permission on \"${0}\".", filePath),
		},
	},
	backToPrevious: backToPrevious,
} as const;
