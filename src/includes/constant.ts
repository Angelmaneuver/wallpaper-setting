import { VSCodePreset } from "./utils/base/vscodePreset";

export const confirmItemsCreat = (description: { yes: string, no: string, return?: string }) => {
	return [
		VSCodePreset.create(VSCodePreset.Icons.check, "Yes", description.yes),
		VSCodePreset.create(VSCodePreset.Icons.x,     "No",  description.no)
	].concat(
		description.return ? VSCodePreset.create(VSCodePreset.Icons.reply, "Return", description.return) : []
	);
}

export const wallpaperType: { [key: string]: number } = { Image: 0, Slide: 1 };
export const applyImageFile                           = ["png", "jpg", "jpeg", "gif"];
export const maximumOpacity                           = 0.5;
export const minimumOpacity                           = 1;
export const minimumSlideInterval                     = 0.1;
export const slideIntervalUnit                        = ["Hour", "Minute", "Second", "MilliSecond"].map((label) => ({ label }));
export const slideRandomPlay                          = confirmItemsCreat({ yes: "Random",          no: "Not random." });
export const slideEffectFadeIn                        = confirmItemsCreat({ yes: "Fade in effect.", no: "Not effect." });
export const favoriteProcess                          = [
	VSCodePreset.create(VSCodePreset.Icons.repoPush,   "Register",   "Register the current settings to favorite."),
	VSCodePreset.create(VSCodePreset.Icons.repoDelete, "UnRegister", "UnRegister favorite settings."),
	VSCodePreset.create(VSCodePreset.Icons.repoPull,   "Load",       "Load favorite settings."),
	VSCodePreset.create(VSCodePreset.Icons.merge,      "Start Up",   "Start up settings."),
	VSCodePreset.create(VSCodePreset.Icons.reply,      "Return",     "Return without saving any changes."),
];
export const favoriteRandomSet                        = confirmItemsCreat({ yes: "Random wallpaper at start up.", no: "Not random.", return: "Return without saving any changes." });
