import * as path from 'path';
import * as fs   from 'fs';


export class File {
    private _path:    string = '';
    private _content: any    = null;

    constructor(
        targetPath: string,
        options?:   {}
    ) {
        this.path = targetPath;

        if(this.path) {
            try {
                this.content = fs.readFileSync(path.resolve(this.path), options);
            } catch(e) {
                this.content = null;
            }
        }
    }

    get path(): string {
        return this._path;
    }

    set path(targetPath: string) {
        this._path = targetPath;
    }

    get extension(): string {
        return path.extname(this._path).replace('.', '');
    }

    get content(): any {
        return this._content;
    }

    set content(value: any) {
        this._content = value;
    }

    get isPresent(): boolean {
        return this.content ? true : false;
    }

    public write(options?: {}) {
        if(this.isPresent) {
            try {
                fs.writeFileSync(path.resolve(this.path), this.content, options);
            } catch(e) {
                console.debug(e);
                throw e;
            }
        }
    }

    public toBase64(): string {
        try {
            return this.isPresent ? this.content?.toString('base64') : '';
        } catch(e) {
            throw e;
        }
    }
}
