import { ConfigurationTarget } from 'vscode';
import { SettingBase }         from "./base";

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

export class ExtensionSetting extends SettingBase {
	public static propertyIds = {
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

	private _filePath:          string;
	private _slideFilePaths:    Array<string>;
	private _opacity:           number;
	private _slideInterval:     number;
	private _slideIntervalUnit: string;
	private _slideRandomPlay:   boolean;
	private _slideEffectFadeIn: boolean;
	private _favoriteImageSet:  Favorite;
	private _favoriteSlideSet:  Favorite;
	private _favoriteRandomSet: boolean;

	constructor() {
		super("wallpaper-setting", ConfigurationTarget.Global);
		this._filePath          = this.get(ExtensionSetting.propertyIds.filePath);
		this._slideFilePaths    = this.get(ExtensionSetting.propertyIds.slideFilePaths);
		this._opacity           = this.get(ExtensionSetting.propertyIds.opacity);
		this._slideInterval     = this.get(ExtensionSetting.propertyIds.slideInterval);
		this._slideIntervalUnit = this.get(ExtensionSetting.propertyIds.slideIntervalUnit);
		this._slideRandomPlay   = this.get(ExtensionSetting.propertyIds.slideRandomPlay);
		this._slideEffectFadeIn = this.get(ExtensionSetting.propertyIds.slideEffectFadeIn);
		this._favoriteImageSet  = this.get(ExtensionSetting.propertyIds.favoriteImageSet);
		this._favoriteSlideSet  = this.get(ExtensionSetting.propertyIds.favoriteSlideSet);
		this._favoriteRandomSet = this.get(ExtensionSetting.propertyIds.favoriteRandomSet);
	}

	public setFilePath(value: string | undefined): void {
		this._filePath = value === undefined ? "" : value;
	}

	public get filePath(): string {
		return this._filePath;
	}

	public setSlideFilePaths(value: string[] | undefined): void {
		this._slideFilePaths = value === undefined ? [] : value;
	}

	public get slideFilePaths(): string[] {
		return this._slideFilePaths;
	}

	public setOpacity(value: number | undefined): void {
		this._opacity = value === undefined ? 0.75 : value;
	}

	public get opacity(): number {
		return this._opacity;
	}

	public setSlideInterval(value: number | undefined): void {
		this._slideInterval = value === undefined ? 25 : value;
	}

	public get slideInterval(): number {
		return this._slideInterval;
	}

	public setSlideIntervalUnit(value: string | undefined): void {
		this._slideIntervalUnit = value === undefined ? "Minute" : value;
	}

	public get slideIntervalUnit(): string {
		return this._slideIntervalUnit;
	}

	public setSlideRandomPlay(value: boolean | undefined): void {
		this._slideRandomPlay = value === undefined ? false : value;
	}

	public get slideRandomPlay(): boolean {
		return this._slideRandomPlay;
	}

	public setSlideEffectFadeIn(value: boolean | undefined): void {
		this._slideEffectFadeIn = value === undefined ? true : value;
	}

	public get slideEffectFadeIn(): boolean {
		return this._slideEffectFadeIn;
	}

	public setFavoriteImageSet(value: Favorite | undefined): void {
		this._favoriteImageSet = value === undefined ? {} : value;
	}

	public get favoriteImageSet(): Favorite {
		return this._favoriteImageSet;
	}

	public setFavoriteSlideSet(value: Favorite | undefined): void {
		this._favoriteSlideSet = value === undefined ? {} : value;
	}

	public get favoriteSlideSet(): Favorite {
		return this._favoriteSlideSet;
	}

	public setFavoriteRandomSet(value: boolean | undefined): void {
		this._favoriteRandomSet = value === undefined ? false : value;
	}

	public get favoriteRandomSet(): boolean {
		return this._favoriteRandomSet;
	}

	public get slideIntervalUnit2Millisecond(): number {
		let baseTime: number = 1;

		switch (this.slideIntervalUnit) {
			case "Hour":
				baseTime *= 60;
			case "Minute":
				baseTime *= 60;
			case "Second":
				baseTime *= 1000;
			default:
				baseTime *= 1;
		}

		return this.slideInterval * baseTime;
	}

	public get isFavoriteExist(): {
		image: boolean,
		slide: boolean
	} | boolean {
		if (Object.keys(this.favoriteImageSet).length > 0 || Object.keys(this.favoriteSlideSet).length > 0) {
			return {
				image: Object.keys(this.favoriteImageSet).length > 0,
				slide: Object.keys(this.favoriteSlideSet).length > 0,
			};
		} else {
			return false;
		}
	}

	public async uninstall(): Promise<void> {
		await this.remove(ExtensionSetting.propertyIds.filePath);
		await this.remove(ExtensionSetting.propertyIds.slideFilePaths);
		await this.remove(ExtensionSetting.propertyIds.opacity);
		await this.remove(ExtensionSetting.propertyIds.slideInterval);
		await this.remove(ExtensionSetting.propertyIds.slideIntervalUnit);
		await this.remove(ExtensionSetting.propertyIds.slideRandomPlay);
		await this.remove(ExtensionSetting.propertyIds.slideEffectFadeIn);
		await this.remove(ExtensionSetting.propertyIds.favoriteImageSet);
		await this.remove(ExtensionSetting.propertyIds.favoriteSlideSet);
		await this.remove(ExtensionSetting.propertyIds.favoriteRandomSet);
	}
}
