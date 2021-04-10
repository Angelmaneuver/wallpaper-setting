import { ConfigurationTarget } from 'vscode';
import { SettingBase }         from "./base";

export interface Favorite {
	[key: string]: {
		filePath?:          string,
		slideFilePaths?:    string[],
		opacity?:           number,
		slideInterval?:     number,
		slideIntervalUnit?: string
	}
}

export class ExtensionSetting extends SettingBase {
	public filePath:          string;
	public slideFilePaths:    Array<string>;
	public opacity:           number;
	public slideInterval:     number;
	public slideIntervalUnit: string;
	public favoriteImageSet:  Favorite;
	public favoriteSlideSet:  Favorite;

	constructor() {
		super("wallpaper-setting", ConfigurationTarget.Global);
		this.filePath          = this.get("filePath");
		this.slideFilePaths    = this.get("slideFilePaths");
		this.opacity           = this.get("opacity");
		this.slideInterval     = this.get("slideInterval");
		this.slideIntervalUnit = this.get("slideIntervalUnit");
		this.favoriteImageSet  = this.get("favoriteWallpaperImageSet");
		this.favoriteSlideSet  = this.get("favoriteWallpaperSlideSet");
	}

	get slideIntervalUnit2Millisecond(): number {
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

	get isFavoriteExist(): {
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
		await this.remove("filePath");
		await this.remove("slideFilePaths");
		await this.remove("opacity");
		await this.remove("slideInterval");
		await this.remove("slideIntervalUnit");
		await this.remove("favoriteWallpaperImageSet");
		await this.remove("favoriteWallpaperSlideSet");
	}
}
