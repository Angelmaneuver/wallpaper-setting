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

export abstract class SettingSyncBase {
	protected static _ids: {[key: string]: string}

	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;

		this.context.globalState.setKeysForSync(
			Object.values(SettingSyncBase.ids)
		);
	}

	public static get ids(): {[key: string]: string} {
		return this._ids;
	}

	public async set(key: string, value: unknown): Promise<void> {
		return this.context.globalState.update(key, value);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get(key: string, defaultValue: any): unknown {
		return this.context.globalState.get(key, defaultValue);
	}

	public async remove(key: string): Promise<void> {
		return this.set(key, undefined);
	}
}
