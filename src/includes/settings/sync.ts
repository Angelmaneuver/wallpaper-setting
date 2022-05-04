import * as vscode         from "vscode";
import { SettingSyncBase } from "./base";

export class SettingSync extends SettingSyncBase {
	constructor(context: vscode.ExtensionContext) {
		SettingSyncBase._ids = {
			data:    "data",
			iv:      "iv",
			opacity: "opacity",
		};

		super(context);
	}

	public static getInstance(context: vscode.ExtensionContext): SettingSync {
		return new SettingSync(context);
	}

	public get isAvailable(): boolean {
		const [iv, data] = this.getData;

		return iv.length > 0 && data.length > 0 ? true : false;
	}

	public async uninstall(): Promise<void> {
		for (const key of Object.keys(SettingSyncBase.ids)) {
			await this.remove(SettingSyncBase.ids[key]);
		}
	}

	public async setData(iv: string, data: string): Promise<void> {
		await this.set(SettingSync.ids.iv, iv);
		return this.set(SettingSync.ids.data, data);
	}

	public get getData(): [string, string] {
		return [
			this.get(SettingSync.ids.iv, "") as string,
			this.get(SettingSync.ids.data, "") as string,
		];
	}

	public async setOpacity(opacity: number): Promise<void> {
		return this.set(SettingSync.ids.opacity, opacity);
	}

	public get getOpacity(): number {
		return this.get(SettingSync.ids.opacity, 0.75) as number;
	}
}
