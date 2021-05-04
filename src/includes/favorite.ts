import * as Installer       from "./installer";
import { ExtensionSetting } from "./settings/extension";
import * as Constant        from "./constant";

interface Favorite{ name: string, type: number }
interface FavoritesByHash{ [key: string]: unknown }

const choice         = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) +min;
};
const favorite2array = (
	(favoriteType: number, favorites: FavoritesByHash) => {
		const temporary: Array<Favorite> = new Array<Favorite>();
		Object.keys(favorites).map((name) => {temporary.push({ name: name, type: favoriteType});});
		
		return temporary;
	}
)
const favoriteSetter = (
	(favorite: { [key:string]: unknown }, setting: ExtensionSetting) => {
		Object.keys(favorite).forEach(
			(key) => { setting.setItemValueNotRegist(key, favorite[key]); }
		);
	}
);

export async function randomSet(): Promise<void> {
	const setting   = new ExtensionSetting();
	const installer = Installer.getInstance(setting);

	if (setting.isFavoriteRegisterd && setting.favoriteRandomSet.validValue) {
		const favorites =
			new Array<Favorite>()
			.concat(favorite2array(Constant.wallpaperType.Image, setting.favoriteImageSet.value))
			.concat(favorite2array(Constant.wallpaperType.Slide, setting.favoriteSlideSet.value));
		const selection = favorites[choice(0, favorites.length -1)];

		if (selection.type === Constant.wallpaperType.Image) {
			favoriteSetter(setting.favoriteImageSet.value[selection.name], setting);
			installer.install();
		} else {
			favoriteSetter(setting.favoriteSlideSet.value[selection.name], setting);
			installer.installAsSlide();
		}
	}
}
