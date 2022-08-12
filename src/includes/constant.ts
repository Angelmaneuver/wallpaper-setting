import { QuickPickItem } from "vscode";
import { VSCodePreset }  from "./utils/base/vscodePreset";

export const ItemType   = { Confirm: 0, Wallpaper: 1 };
export const itemsCreat = (type: number, description: { item1: string, item2: string, return?: string }): Array<QuickPickItem> => {
	let items: Array<QuickPickItem> = [];

	switch (type) {
		case ItemType.Confirm:
			items = [
				VSCodePreset.create(VSCodePreset.Icons.check,     "Yes",   description.item1),
				VSCodePreset.create(VSCodePreset.Icons.x,         "No",    description.item2)
			];
			break;
		case ItemType.Wallpaper:
			items = [
				VSCodePreset.create(VSCodePreset.Icons.fileMedia, "Image", description.item1),
				VSCodePreset.create(VSCodePreset.Icons.folder,    "Slide", description.item2),
			];
			break;
		default:
			throw new ReferenceError("Requested parameter type " + type + " not support with this method...");
	}

	return items.concat(description.return ? VSCodePreset.create(VSCodePreset.Icons.reply, "Return", description.return) : []);
}
export const wallpaperType: { [key: string]: number } = { Image: 0, Slide: 1 };
export const applyImageFile                           = ["png", "jpg", "jpeg", "gif", "webp"];
export const maximumOpacity                           = 0.5;
export const maximumOpacityWithAdvancedMode           = 0;
export const minimumOpacity                           = 1;
export const minimumSlideInterval                     = 0.1;
export const slideIntervalUnit                        = ["Hour", "Minute", "Second", "MilliSecond"].map((label) => ({ label }));
export const back2Previous                            = VSCodePreset.create(VSCodePreset.Icons.reply, "Return", "Back to previous.");
export const slideRandomPlay                          = itemsCreat(ItemType.Confirm, { item1: "Random",          item2: "Not random." });
export const slideEffectFadeIn                        = itemsCreat(ItemType.Confirm, { item1: "Fade in effect.", item2: "Not effect." });
export const favoriteProcess                          = [
	VSCodePreset.create(VSCodePreset.Icons.repoPush,    "Register",    "Register the current settings to favorite."),
	VSCodePreset.create(VSCodePreset.Icons.repoPull,    "Open",        "Open the favorite list."),
	VSCodePreset.create(VSCodePreset.Icons.merge,       "Start Up",    "Start up settings."),
	back2Previous,
];
export const favoriteOperationExecute                 = [
	VSCodePreset.create(VSCodePreset.Icons.debugStart,  "Set",         "Set wallpaper with this setting."),
	VSCodePreset.create(VSCodePreset.Icons.emptyWindow, "Window Open", "Open a new window with this setting."),
	VSCodePreset.create(VSCodePreset.Icons.trashcan,    "Delete",      "Delete this setting."),
	back2Previous,
];
export const favoriteRandomSet                        = itemsCreat(ItemType.Confirm, { item1: "Random wallpaper at start up.", item2: "Not random.", return: "Return without saving any changes." });
export const favoriteRandomSetFilter                  = [
	VSCodePreset.create(VSCodePreset.Icons.checkAll,    "All",         "Target all images and slides.")
].concat(
	itemsCreat(ItemType.Wallpaper, { item1:  "Images only.", item2:  "Slides only.", return: "Return without saving any changes." })
);
export const syncImageSize                            = 500 * 1024;
export const syncImageSize4Display                    = "500KB";
