import { ConfigurationTarget } from 'vscode';
import { SettingBase }         from "./base";

export class ExtensionSetting extends SettingBase {
	public filePath:          string;
	public slideFilePaths:    Array<string>;
	public opacity:           number;
	public slideInterval:     number;
	public slideIntervalUnit: string;

	constructor() {
		super("wallpaper-setting", ConfigurationTarget.Global);
		this.filePath          = this.get("filePath");
		this.slideFilePaths    = this.get("slideFilePaths");
		this.opacity           = this.get("opacity");
		this.slideInterval     = this.get("slideInterval");
		this.slideIntervalUnit = this.get("slideIntervalUnit");
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

	public async uninstall(): Promise<void> {
		await this.remove("filePath");
		await this.remove("slideFilePaths");
		await this.remove("opacity");
		await this.remove("slideInterval");
		await this.remove("slideIntervalUnit");
	}
}
