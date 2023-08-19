import { l10n } from "vscode";

export const words = {
	headline: {
		setting:         l10n.t(" - Individual Settings"),
		image:           l10n.t(" - Image Path"),
		slide:           {
			filePaths:        l10n.t(" - Image Files Path"),	
			interval:         {
				time: l10n.t(" - Slide Interval"),
				unit: l10n.t(" - Slide Interval Unit"),
			},
			random:           l10n.t(" - Slide Random Playback"),
			effectFadeIn:     l10n.t(" - Slide Effect Fade In"),
			loadWaitComplete: l10n.t(" - Slide Image Load Wait"),
		},
		opacity:         l10n.t(" - Opacity"),
		favorite:        l10n.t(" - Favorite"),
		wallpaper:       l10n.t(" - Select Setup Type"),
		setup:           l10n.t(" - Image Setup"),
		setupAsSlide:    l10n.t(" - Slide Setup"),
		startUp:         l10n.t(" - Start Up"),
		optimize:        l10n.t(" - Optimize"),
		processExplorer: l10n.t(" - Process Explorer"),
		sync:            {
			select:   l10n.t(" - Sync"),
			upload:   l10n.t(" - Upload"),
			download: l10n.t(" - Download"),
		},
		confirm:         l10n.t(" - Confirm"),
	},
	confirm: {
		yes: l10n.t("Yes"),
		no:  l10n.t("No"),
	},
	wallpaper: {
		image: l10n.t("Image wallpaper"),
		slide: l10n.t("Slide wallpaper"),
	},
	slideInterval: l10n.t("slide interval"),
	register:      l10n.t("Register"),
	open:          l10n.t("Open"),
	return:        l10n.t("Return"),
} as const;
