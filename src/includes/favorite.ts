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
const favoriteSetter = (
	(favorite: { [key:string]: any }) => {
		Object.keys(favorite).forEach(
			(key) => { setting.setItemValueNotRegist(key, favorite[key]); }
		);
	}
);

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
			favoriteSetter(setting.favoriteImageSet.value[selection.name]);
			installer.install();
		} else {
			favoriteSetter(setting.favoriteSlideSet.value[selection.name]);
			installer.installAsSlide();
		}
	}
}
