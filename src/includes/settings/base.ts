import * as vscode from 'vscode';


export class SettingBase {
    private key:    string = '';
    private config: vscode.WorkspaceConfiguration;

    constructor(key: string) {
        this.key    = key;
        this.config = vscode.workspace.getConfiguration(this.key);
    }

    public set(
        key:   string,
        value: any
    ): void {
		if(Reflect.has(this, key)) {
			Reflect.set(this, key, value);
		}

        this.config.update(
            key,
            value,
            vscode.ConfigurationTarget.Global
        );
    }

    public get(key: string): any {
        return this.config.get<any>(key);
    }

    public remove(key: string): void {
        this.set(key, undefined);
    }
}
