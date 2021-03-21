import * as vscode from 'vscode';


export class FileSelecter {
    public  canSelectFolders: boolean;
    public  canSelectFiles:   boolean;
    public  canSelectMany:    boolean;
    public  openLable:        string;
    public  filters:          {};
    private fileUrls:         vscode.Uri[] | undefined;

    constructor(initializer: Partial<FileSelecter>) {
        this.canSelectFolders = initializer.canSelectFolders ?? false;
        this.canSelectFiles   = initializer.canSelectFiles   ?? true;
        this.canSelectMany    = initializer.canSelectMany    ?? false;
        this.openLable        = initializer.openLable        ?? '';
        this.filters          = initializer.filters          ?? {};
    }

    public async openFileDialog(callback: (result: FileSelecter) => void) {
        this.fileUrls = await vscode.window.showOpenDialog(
            {
                canSelectFolders: this.canSelectFolders,
                canSelectFiles:   this.canSelectFiles,
                canSelectMany:    this.canSelectMany,
                openLabel:        this.openLable,
                filters:          this.filters,
            }
        );

		callback(this);
    }

    get path(): string {
        return this.fileUrls ? this.fileUrls[0].fsPath : '';
    }
}
