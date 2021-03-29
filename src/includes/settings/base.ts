import * as vscode from "vscode";

export class SettingBase {
	private key: string = "";
	private config: vscode.WorkspaceConfiguration;
	private target: vscode.ConfigurationTarget;

	constructor(key: string, target: vscode.ConfigurationTarget) {
		this.key    = key;
		this.config = vscode.workspace.getConfiguration(this.key);
		this.target = target;
	}

	public async set(key: string, value: any): Promise<void> {
		await this.config.update(key, value, this.target);

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
