import * as path from "path";
import * as fs   from "fs";

export class File {
	private _path:    string = "";
	private _content: any    = null;

	constructor(targetPath: string, options?: {}) {
		this.path = targetPath;

		if (this.path) {
			try {
				this.content = fs.readFileSync(path.resolve(this.path), options);
			} catch (e) {
				throw e;
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
		return File.getExtension(this._path);
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
		if (this.isPresent) {
			try {
				fs.writeFileSync(path.resolve(this.path), this.content, options);
			} catch (e) {
				throw e;
			}
		}
	}

	public toString(): string {
		try {
			return this.isPresent ? this.content?.toString() : "";
		} catch (e) {
			throw e;
		}
	}

	public toBase64(): string {
		try {
			return this.isPresent ? this.content?.toString("base64") : "";
		} catch (e) {
			throw e;
		}
	}

	public static isFile(
		targetPath:       string,
		matchExtensions?: Array<string>
	): boolean {
		let result: boolean = false;

		try {
			if (fs.statSync(targetPath).isFile()) {
				result =
					(!matchExtensions || matchExtensions.includes(File.getExtension(targetPath)))
						? true
						: false
			}
		} catch (e) {}

		return result;
	}

	public static isDirectory(targetPath: string): boolean {
		let result: boolean = false;

		try {
			if (fs.statSync(targetPath).isDirectory()) {
				result = true;
			}
		} catch (e) {}

		return result;
	}

	public static getExtension(targetPath: string): string {
		return path.extname(targetPath).replace(".", "");
	}

	public static getChldrens(
		targetPath: string,
		options?:   {
			filters?:   Array<any>;
			fullPath?:  boolean;
			recursive?: boolean;
		}
	): Array<string> | undefined {
		if (this.isDirectory(targetPath)) {
			return File.getChildren(targetPath, options);
		} else {
			return undefined;
		}
	}

	private static getChildren(
		targetPath: string,
		options?:   {
			filters?:   Array<any>;
			fullPath?:  boolean;
			recursive?: boolean;
		}
	): Array<string> {
		let result:    Array<string> = new Array();
		let files:     Array<string> = new Array();
		let filters:   Array<string> = new Array();
		let filtering: boolean       = false;
		let fullPath:  boolean       = false;
		let recursive: boolean       = false;

		if (options) {
			filters   = options.filters   ? options.filters   : new Array();
			filtering = options.filters   ? true              : false;
			fullPath  = options.fullPath  ? options.fullPath  : false;
			recursive = options.recursive ? options.recursive : false;
		}

		let dirents = fs.readdirSync(targetPath, { withFileTypes: true });
		files       = dirents
			.filter(
				(dirent) =>
					dirent.isFile() &&
					(filters.includes(File.getExtension(dirent.name)) || !filtering)
			)
			.map(({ name }) => (fullPath ? path.join(targetPath, name) : name));

		result      = result.concat(files);

		if (recursive) {
			let directories = dirents
				.filter((dirent) => dirent.isDirectory())
				.map(({ name }) => path.join(targetPath, name));

			directories.forEach((value) => {
				result = result.concat(File.getChildren(value, options));
			});
		}

		return result;
	}
}
