import { ConfigurationTarget } from "vscode";
import { SettingBase }         from "./base";
import { AbstractSettingItem } from "./item/abc";
import { SettingItemFactory }  from "./item/factory/base";
import * as Constant           from "../constant";
import { CONNREFUSED } from "node:dns";

export interface Favorite {
	[key: string]: {
		filePath?:          string,
		slideFilePaths?:    string[],
		opacity?:           number,
		slideInterval?:     number,
		slideIntervalUnit?: string,
		slideRandomPlay?:   boolean,
		slideEffectFadeIn?: boolean
	}
}

type Registerd       = {
	image: boolean,
	slide: boolean
};

type FavoriteAutoSet = number;

export class ExtensionSetting extends SettingBase {
	public static propertyIds: { [key: string]: string }     = {
		filePath:          "filePath",
		slideFilePaths:    "slideFilePaths",
		opacity:           "opacity",
		slideInterval:     "slideInterval",
		slideIntervalUnit: "slideIntervalUnit",
		slideRandomPlay:   "slideRandomPlay",
		slideEffectFadeIn: "slideEffectFadeIn",
		favoriteImageSet:  "favoriteWallpaperImageSet",
		favoriteSlideSet:  "favoriteWallpaperSlideSet",
		favoriteRandomSet: "favoriteWallpaperRandomSet"
	};

	private _items:             AbstractSettingItem[]       = new Array();
	private _isRegisterd:       undefined | Registerd       = undefined;
	private _FavoriteAutoSet:   undefined | FavoriteAutoSet = undefined;

	constructor() {
		super("wallpaper-setting", ConfigurationTarget.Global);

		this.init();
	}

	private init(): void {
		Object.keys(ExtensionSetting.propertyIds).forEach(
			(key) => {
				const id = ExtensionSetting.propertyIds[key];
				this._items.push(SettingItemFactory.create(id, this.get(id)));
			}
		)

		let image: boolean = Object.keys(this.favoriteImageSet).length > 0;
		let slide: boolean = Object.keys(this.favoriteSlideSet).length > 0;

		this._isRegisterd = image || slide ? { image: image, slide: slide } : undefined;

		if (image && !slide) {
			this._FavoriteAutoSet = Constant.wallpaperType.Image;
		} else if (!image && slide) {
			this._FavoriteAutoSet = Constant.wallpaperType.Slide;
		}
	}

	public setItemValueNotRegist(itemId: string, value: any): AbstractSettingItem {
		const item = this.getItem(itemId);
		item.value = value;

		return item;
	}

	public async setItemValue(itemId: string, value: any) {
		await super.set(itemId, this.setItemValueNotRegist(itemId, value).convert4Registration);
	}

	public getItem(itemId: string): AbstractSettingItem {
		const item = this._items.find((item) => { return item.itemId === itemId; });

		if (item) {
			return item;
		} else {
			throw new ReferenceError("Requested " + itemId + "'s class not found...");
		}
	}

	public getItemValue(itemId: string): any {
		const item = this.getItem(itemId);
		return item?.value;
	}

	public async uninstall(): Promise<void> {
		for (let key of Object.keys(ExtensionSetting.propertyIds)) {
			await this.remove(ExtensionSetting.propertyIds[key]);
		}
	}

	public get filePath(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.filePath);
	}

	public get slideFilePaths(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.slideFilePaths);
	}

	public get opacity(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.opacity);
	}

	public get slideInterval(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.slideInterval);
	}

	public get slideIntervalUnit(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.slideIntervalUnit);
	}

	public get slideRandomPlay(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.slideRandomPlay);
	}

	public get slideEffectFadeIn(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.slideEffectFadeIn);
	}

	public get favoriteImageSet(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.favoriteImageSet);
	}

	public get favoriteSlideSet(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.favoriteSlideSet);
	}

	public get favoriteRandomSet(): AbstractSettingItem {
		return this.getItem(ExtensionSetting.propertyIds.favoriteRandomSet);
	}

	public get slideIntervalUnit2Millisecond(): number {
		let baseTime: number = 1;

		switch (this.slideIntervalUnit.value) {
			case "Hour":
				baseTime *= 60;
			case "Minute":
				baseTime *= 60;
			case "Second":
				baseTime *= 1000;
			default:
				baseTime *= 1;
		}

		return this.slideInterval.validValue * baseTime;
	}

	public get isRegisterd(): undefined | Registerd {
		return this._isRegisterd;
	}

	public get FavoriteAutoset(): undefined | FavoriteAutoSet {
		return this._FavoriteAutoSet;
	}
}
