import * as vscode from "vscode";

export class SettingBase {
	private key: string = "";
	private config: vscode.WorkspaceConfiguration;

	constructor(key: string) {
		this.key    = key;
		this.config = vscode.workspace.getConfiguration(this.key);
	}

	public async set(key: string, value: any): Promise<void> {
		await this.config.update(key, value, vscode.ConfigurationTarget.Global);

		if (Reflect.has(this, key)) {
			Reflect.set(this, key, value);
		}
	}

	public get(key: string): any {
		return this.config.get<any>(key);
	}

	public async remove(key: string): Promise<void> {
		await this.set(key, undefined);
	}
}
