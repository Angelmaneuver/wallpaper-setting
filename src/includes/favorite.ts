import * as Installer       from "./installer";
import { ExtensionSetting } from "./settings/extension";
import * as Constant        from "./constant";

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
	if (setting.isRegisterd && setting.favoriteRandomSet.validValue) {
		let favorites: {
			name: string,
			type: number
		}[]           = new Array()
							.concat(favorite2array(type.Image, setting.favoriteImageSet.value))
							.concat(favorite2array(type.Slide, setting.favoriteSlideSet.value));
		let selection = favorites[choice(0, favorites.length -1)];

		if (selection.type === type.Image) {
			let favorite = setting.favoriteImageSet.value[selection.name];

			setting.setItemValue(ExtensionSetting.propertyIds.filePath, favorite.filePath);
			setting.setItemValue(ExtensionSetting.propertyIds.opacity,  favorite.opacity);

			installer.install();
		} else {
			let favorite = setting.favoriteSlideSet.value[selection.name];

			setting.setItemValue(ExtensionSetting.propertyIds.slideFilePaths,     favorite.slideFilePaths);
			setting.setItemValue(ExtensionSetting.propertyIds.opacity,            favorite.opacity);
			setting.setItemValue(ExtensionSetting.propertyIds.slideInterval,      favorite.slideInterval);
			setting.setItemValue(ExtensionSetting.propertyIds.slideIntervalUnit,  favorite.slideIntervalUnit);
			setting.setItemValue(ExtensionSetting.propertyIds.slideRandomPlay,    favorite.slideRandomPlay   ? Constant.slideRandomPlay[0]   : Constant.slideRandomPlay[1]);
			setting.setItemValue(ExtensionSetting.propertyIds.slideEffectFadeIn,  favorite.slideEffectFadeIn ? Constant.slideEffectFadeIn[0] : Constant.slideEffectFadeIn[1]);

			installer.installAsSlide();
		}
	}
}
