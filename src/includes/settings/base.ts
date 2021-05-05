import * as vscode from "vscode";

export class SettingBase {
	private key = "";
	private config: vscode.WorkspaceConfiguration;
	private target: vscode.ConfigurationTarget;

	constructor(key: string, target: vscode.ConfigurationTarget) {
		this.key    = key;
		this.config = vscode.workspace.getConfiguration(this.key);
		this.target = target;
	}

	public async set(key: string, value: unknown): Promise<void> {
		await this.config.update(key, value, this.target);
	}

	public get(key: string): unknown {
		return this.config.get<unknown>(key);
	}

	public async remove(key: string): Promise<void> {
		await this.set(key, undefined);
	}
}
