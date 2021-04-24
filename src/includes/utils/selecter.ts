import * as vscode from "vscode";

export class Selecter {
	public  canSelectFolders: boolean;
	public  canSelectFiles:   boolean;
	public  canSelectMany:    boolean;
	public  openLable:        string;
	public  filters:          { [name: string]: Array<string> } | undefined;
	private fileUrls:         vscode.Uri[] | undefined;

	constructor(initializer: Partial<Selecter>) {
		this.canSelectFolders = initializer.canSelectFolders ?? false;
		this.canSelectFiles   = initializer.canSelectFiles   ?? true;
		this.canSelectMany    = initializer.canSelectMany    ?? false;
		this.openLable        = initializer.openLable        ?? "";
		this.filters          = initializer.filters          ?? {};
	}

	public async openFileDialog(): Promise<Selecter> {
		this.fileUrls = await vscode.window.showOpenDialog(
			{
				canSelectFolders: this.canSelectFolders,
				canSelectFiles:   this.canSelectFiles,
				canSelectMany:    this.canSelectMany,
				openLabel:        this.openLable,
				filters:          this.filters,
			}
		);

		return this;
	}

	get path(): string {
		return this.fileUrls ? this.fileUrls[0].fsPath : "";
	}
}
