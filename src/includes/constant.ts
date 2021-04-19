import { VSCodePreset } from "./utils/base/vscodePreset";

export const wallpaperType: { [key: string]: number } = { Image: 0, Slide: 1 };
export const applyImageFile                           = ["png", "jpg", "jpeg", "gif"];
export const maximumOpacity                           = 0.5;
export const minimumOpacity                           = 1;
export const minimumSlideInterval                     = 0.1;
export const slideIntervalUnit                        = ["Hour", "Minute", "Second", "MilliSecond"].map((label) => ({ label }));
export const slideRandomPlay                          = [
	VSCodePreset.create(VSCodePreset.Icons.check,      "Yes",        "Random"),
	VSCodePreset.create(VSCodePreset.Icons.x,          "No",         "Not random"),
];
export const slideEffectFadeIn                        = [
	VSCodePreset.create(VSCodePreset.Icons.check,      "Yes",        "Fade in effect"),
	VSCodePreset.create(VSCodePreset.Icons.x,          "No",         "Not effect"),
];
export const favoriteProcess                          = [
	VSCodePreset.create(VSCodePreset.Icons.repoPush,   "Register",   "Register the current settings to favorite."),
	VSCodePreset.create(VSCodePreset.Icons.repoDelete, "UnRegister", "UnRegister favorite settings."),
	VSCodePreset.create(VSCodePreset.Icons.repoPull,   "Load",       "Load favorite settings."),
	VSCodePreset.create(VSCodePreset.Icons.merge,      "Start Up",   "Start up settings."),
	VSCodePreset.create(VSCodePreset.Icons.reply,      "Return",     "Return without saving any changes."),
];
export const favoriteRandomSet                        = [
	VSCodePreset.create(VSCodePreset.Icons.check,      "Yes",        "Random wallpaper at start up."),
	VSCodePreset.create(VSCodePreset.Icons.x,          "No",         "Not random."),
	VSCodePreset.create(VSCodePreset.Icons.reply,      "Return",     "Return without saving any changes."),
];
