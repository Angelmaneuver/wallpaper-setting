import * as Installer       from "./installer";
import { ExtensionSetting } from "./settings/extension";

const type           = { Image: 0, Slide: 1 };
const choice         = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) +min;
};
const setting        = new ExtensionSetting();
const installer      = Installer.getInstance(setting);
const favorite2array = (
	(favoriteType: number, favorites: { [key: string]: any }) => {
		let temporary: { name: string, type: number }[] = [];
		Object.keys(favorites).map((name) => {temporary.push({ name: name, type: favoriteType});});
		
		return temporary;
	}
)

export async function randomSet() {
	if (!(typeof(setting.isFavoriteExist) === "boolean") && setting.favoriteRandomSet) {
		let favorites: {
			name: string,
			type: number
		}[]           = new Array()
							.concat(favorite2array(type.Image, setting.favoriteImageSet))
							.concat(favorite2array(type.Slide, setting.favoriteSlideSet));
		let selection = favorites[choice(0, favorites.length -1)];

		if (selection.type === type.Image) {
			let favorite = setting.favoriteImageSet[selection.name];

			setting.setFilePath (favorite.filePath);
			setting.setOpacity  (favorite.opacity);

			installer.install();
		} else {
			let favorite = setting.favoriteSlideSet[selection.name];

			setting.setSlideFilePaths    (favorite.slideFilePaths);
			setting.setOpacity           (favorite.opacity);
			setting.setSlideInterval     (favorite.slideInterval);
			setting.setSlideIntervalUnit (favorite.slideIntervalUnit);
			setting.setSlideRandomPlay   (favorite.slideRandomPlay);
			setting.setSlideEffectFadeIn (favorite.slideEffectFadeIn);

			installer.installAsSlide();
		}
	}
}
