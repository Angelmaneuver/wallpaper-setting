import { l10n, QuickPickItem } from "vscode";
import { VSCodePreset }        from "../utils/base/vscodePreset";

export const confirmItemType = { confirm: 0, wallpaper: 1 } as const;
type  ConfirmItemType        = typeof confirmItemType[keyof typeof confirmItemType];

export const quickpicks = {
	begin: {
		set: [
			l10n.t("Set"),
			l10n.t("Set wallpaper with current settings."),
		],
		reset: [
			l10n.t("Reset"),
			l10n.t("Reset wallpaper with current settings."),
		],
		clear: [
			l10n.t("Clear"),
			l10n.t("Erase the wallpaper."),
		],
		setting: [
			l10n.t("Setting"),
			l10n.t("Set Parameters individually."),
		],
		favorite: [
			l10n.t("Favorite"),
			l10n.t("Configure settings related to favorites."),
		],
		setup: [
			l10n.t("Setup Image"),
			l10n.t("Set an image to wallpaper."),
		],
		setUpAsSlide: [
			l10n.t("Setup Slide"),
			l10n.t("Set an image slide to wallpaper."),
		],
		optimize: [
			l10n.t("Optimize"),
			l10n.t("Optimize the current color theme."),
		],
		processExplorer: [
			l10n.t("Process Explorer"),
			l10n.t("Set an background color of the Process Explorer."),
		],
		sync: [
			l10n.t("Sync"),
			l10n.t("Configure settings related to Sync."),
		],
		uninstall: [
			l10n.t("Uninstall"),
			l10n.t("Remove all parameters for this extension."),
		],
		exit: [
			l10n.t("Exit"),
			l10n.t("Exit without saving any changes."),
		],
	},
	slide: {
		interval:     {
			unit: ["Hour", "Minute", "Second", "MilliSecond"].map((label) => ({ label })),
		},
		randomPlay:       confirmItem(confirmItemType.confirm, { item1: l10n.t("Random."),         item2: l10n.t("Not random.") }),
		effectFadeIn:     confirmItem(confirmItemType.confirm, { item1: l10n.t("Fade in effect."), item2: l10n.t("Not effect.") }),
		loadWaitComplete: confirmItem(confirmItemType.confirm, { item1: l10n.t("Wait."),           item2: l10n.t("Not wait.") } )},
	parameter: {
		image: [
			l10n.t("Image Path"),
			l10n.t("Set the image to be used as the wallpaper."),
		],
		slide: {
			filePaths: [
				l10n.t("Image Files Path"),
				l10n.t("Set the images to be used as the slide."),
			],
			interval: {
				time: [
					l10n.t("Slide Interval"),
					l10n.t("Set the slide interval."),
				],
				unit: [
					l10n.t("Slide Interval's Unit"),
					l10n.t("Set the slide interval's unit."),
				],
			},
			random: [
				l10n.t("Slide Random Playback"),
				l10n.t("Set whether to play the slides randomly."),
			],
			effectFadeIn: [
				l10n.t("Effect Fade in"),
				l10n.t("Set whether to use fade in effect."),
			],
			loadWaitComplete: [
				l10n.t("Load Wait Complete"),
				l10n.t("Set whether to wait for image loading."),
			],
		},
		opacity: [
			l10n.t("Opacity"),
			l10n.t("Set the opacity of the wallpaper."),
		],
		save: [
			l10n.t("Save"),
			l10n.t("Save changes."),
		],
		return: [
			l10n.t("Return"),
			l10n.t("Return without saving any changes."),
		],
	},
	wallpaper: confirmItem(confirmItemType.wallpaper, {
		item1:  l10n.t("Set an image to wallpaper."),
		item2:  l10n.t("Set an image slide to wallpaper."),
		return: l10n.t("Back to previous."),
	}),
	favorite: {
		select: {
			process: {
				regisiter: [
					l10n.t("Register"),
					l10n.t("Register the current settings to favorite."),
				],
				open: [
					l10n.t("Open"),
					l10n.t("Open the favorite list."),
				],
				startUp: [
					l10n.t("Start Up"),
					l10n.t("Start up settings."),
				],
			},
			operation: {
				register: confirmItem(confirmItemType.wallpaper, {
					item1:  l10n.t("register favorite the current wallpaper image settings."),
					item2:  l10n.t("register favorite the current wallpaper slide settings."),
					return: l10n.t("Back to previous."),
				}),
				open: confirmItem(confirmItemType.wallpaper, {
					item1:  l10n.t("Open wallpaper image settings from favorites."),
					item2:  l10n.t("Open wallpaper slide settings from favorites."),
					return: l10n.t("Back to previous."),
				}),
			},
		},
		set: [
			l10n.t("Set"),
			l10n.t("Set wallpaper with this setting."),
		],
		windowOpen: [
			l10n.t("Window Open"),
			l10n.t("Open a new window with this setting."),
		],
		delete: [
			l10n.t("Delete"),
			l10n.t("Delete this setting."),
		],
		randomSet: confirmItem(confirmItemType.confirm, { item1: l10n.t("Random wallpaper at start up."), item2: l10n.t("Not random."), return: l10n.t("Return without saving any changes.") }),
		randomSetFilter: [
			VSCodePreset.create(VSCodePreset.Icons.checkAll, l10n.t("All"), l10n.t("Target all images and slides."))
		].concat(
			confirmItem(confirmItemType.wallpaper, { item1:  l10n.t("Images only."), item2: l10n.t("Slides only."), return: l10n.t("Return without saving any changes.") })
		),
	},
	sync: {
		upload: [
			l10n.t("Upload"),
			l10n.t("Upload wallpaper settings."),
		],
		download: [
			l10n.t("Download"),
			l10n.t("Download wallpaper settings and set."),
		],
		delete: [
			l10n.t("Delete"),
			l10n.t("Delete wallpaper settings."),
		],
		return: [
			l10n.t("Return"),
			l10n.t("Return without saving any changes."),
		],
	},
	backToPrevious: VSCodePreset.create(VSCodePreset.Icons.reply, l10n.t("Return"), l10n.t("Back to previous.")),
} as const;

export function confirmItem(type: ConfirmItemType, description: { item1: string, item2: string, return?: string }): Array<QuickPickItem> {
	const parameter = ((type) => {
		if (confirmItemType.confirm === type) {
			return [
				{ baseIcon: VSCodePreset.Icons.check,     label: l10n.t("Yes"),   description: description.item1 },
				{ baseIcon: VSCodePreset.Icons.x,         label: l10n.t("No"),    description: description.item2 },
			];
		} else {
			return [
				{ baseIcon: VSCodePreset.Icons.fileMedia, label: l10n.t("Image"), description: description.item1 },
				{ baseIcon: VSCodePreset.Icons.folder,    label: l10n.t("Slide"), description: description.item2 },
			];
		}
	})(type);

	const items = parameter.map((value) => VSCodePreset.create(value.baseIcon, value.label, value.description));

	return items.concat(description.return ? VSCodePreset.create(VSCodePreset.Icons.reply, l10n.t("Return"), description.return) : []);
}
