import * as path    from "path";
import * as fs      from "fs";
import { Optional } from "./optional";

type FsOption     = { encoding?: string; flag?: string; };
type Filter       = { name?: string, extension?: Array<string> };
type SearchOption = { filter?: Filter; fullPath?:  boolean; recursive?: boolean; }

export class File {
	private _path:    string;
	private _content: string | Buffer | null;

	constructor(targetPath: string, options?: FsOption) {
		if (typeof(targetPath) === "string" && targetPath.length > 0) {
			this._path    = targetPath;
			this._content = fs.readFileSync(path.resolve(this.path), options);
		} else {
			throw new ReferenceError("File path is not specified.");
		}
	}

	get path(): string {
		return this._path;
	}

	get extension(): string {
		return File.getExtension(this._path);
	}

	get content(): string | Buffer | null {
		return this._content;
	}

	set content(value: string | Buffer | null) {
		this._content = value;
	}

	get isPresent(): boolean {
		return this.content ? true : false;
	}

	public write(options?: fs.WriteFileOptions): void {
		fs.writeFileSync(path.resolve(this.path), this.content, options);
	}

	public toString(): string {
		return Optional.ofNullable(this._content?.toString()).orElseNonNullable("");
	}

	public toBase64(): string {
		return Optional.ofNullable(this._content?.toString("base64")).orElseNonNullable("");
	}

	public static isFile(
		targetPath:       string,
		matchExtensions?: Array<string>
	): boolean {
		let result = false;

		try {
			if (fs.statSync(targetPath).isFile()) {
				result =
					(!matchExtensions || matchExtensions.includes(File.getExtension(targetPath)))
						? true
						: false
			}
		} catch (e) {
			return result;
		}

		return result;
	}

	public static isDirectory(targetPath: string): boolean {
		let result = false;

		try {
			if (fs.statSync(targetPath).isDirectory()) {
				result = true;
			}
		} catch (e) {
			return result;
		}

		return result;
	}

	public static getFilename(targetPath: string): string {
		return path.basename(targetPath, path.extname(targetPath));
	}

	public static getExtension(targetPath: string): string {
		return path.extname(targetPath).replace(".", "");
	}

	public static getChildrens(
		targetPath: string,
		options?:   SearchOption
	): Array<string> | undefined {
		if (this.isDirectory(targetPath)) {
			return File.getChildren(targetPath, options);
		} else {
			return undefined;
		}
	}

	private static getChildren(
		targetPath: string,
		options?:   SearchOption
	): Array<string> {
		const filter             = Optional.ofNullable(options?.filter).orElseNonNullable({}) as Filter;
		const nameFilter         = Optional.ofNullable(filter.name).orElseNonNullable("");
		const nameFiltering      = nameFilter.length > 0 ? true : false;
		const extensionFilter    = Optional.ofNullable(filter.extension).orElseNonNullable([]);
		const extensionFiltering = extensionFilter.length > 0 ? true : false;
		const fullPath           = Optional.ofNullable(options?.fullPath).orElseNonNullable(false);
		const recursive          = Optional.ofNullable(options?.recursive).orElseNonNullable(false);
		const dirents            = fs.readdirSync(targetPath, { withFileTypes: true });

		let   result             = this.getFiles(targetPath, dirents, nameFilter, nameFiltering, extensionFilter, extensionFiltering, fullPath);

		if (recursive) {
			this.getDirectories(targetPath, dirents).forEach((value) => { result = result.concat(File.getChildren(value, options)); });
		}

		return result;
	}

	private static getFiles(
		targetPath:         string,
		dirents:            fs.Dirent[],
		nameFilter:         string,
		nameFiltering:      boolean,
		extensionFilter:    Array<string>,
		extensionFiltering: boolean,
		fullPath:           boolean
	): string[] {
		return dirents
				.filter((dirent) => { return (
					dirent.isFile()
					&& (File.getFilename(dirent.name).includes(nameFilter)       || !nameFiltering)
					&& (extensionFilter.includes(File.getExtension(dirent.name)) || !extensionFiltering)
				); }
				).map(({ name }) => (fullPath ? path.join(targetPath, name) : name));
	}

	private static getDirectories(
		targetPath: string,
		dirents:    fs.Dirent[]
	): string[] {
		return dirents
				.filter((dirent) => { return dirent.isDirectory(); }
				).map(({ name }) => path.join(targetPath, name));
	}
}
