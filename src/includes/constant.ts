import { VSCodePreset } from "./utils/base/vscodePreset";

export class Constant {
	public static wallpaperType: {
		[key: string]: number
	}                                  = { Image: 0, Slide: 1 };
	public static applyImageFile       = ["png", "jpg", "jpeg", "gif"];
	public static slideIntervalUnit    = ["Hour", "Minute", "Second", "MilliSecond"].map((label) => ({ label }));
	public static slideRandomPlay      = [
		VSCodePreset.create(VSCodePreset.Icons.check,      "Yes",        "Random"),
		VSCodePreset.create(VSCodePreset.Icons.x,          "No",         "Not random")
	];
	public static slideEffectFadeIn    = [
		VSCodePreset.create(VSCodePreset.Icons.check,      "Yes",        "Fade in effect"),
		VSCodePreset.create(VSCodePreset.Icons.x,          "No",         "Not effect"),
	];
	public static favoriteProcess      = [
		VSCodePreset.create(VSCodePreset.Icons.repoPush,   "Register",   "Register the current settings to favorite."),
		VSCodePreset.create(VSCodePreset.Icons.repoDelete, "UnRegister", "UnRegister favorite settings."),
		VSCodePreset.create(VSCodePreset.Icons.repoPull,   "Load",       "Load favorite settings."),
		VSCodePreset.create(VSCodePreset.Icons.merge,      "Start Up",   "Start up settings."),
		VSCodePreset.create(VSCodePreset.Icons.mailReply,  "Return",     "Return without saving any changes."),
	];
	public static favoriteRandomSet    = [
		VSCodePreset.create(VSCodePreset.Icons.check,      "Yes",        "Random wallpaper at start up."),
		VSCodePreset.create(VSCodePreset.Icons.x,          "No",         "Not random."),
		VSCodePreset.create(VSCodePreset.Icons.reply,      "Return",     "Return without saving any changes."),
	];
	public static maximumOpacity       = 0.5;
	public static minimumOpacity       = 1;
	public static minimumSlideInterval = 0.1;
}
