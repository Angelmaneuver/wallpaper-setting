import * as path    from "path";
import * as fs      from "fs";
import { Optional } from "./optional";

type FsOption     = { encoding?: string; flag?: string; };
type SearchOption = { filters?: Array<string>; fullPath?:  boolean; recursive?: boolean; }

export class File {
	private _path         = "";
	private _content: any = null;

	constructor(targetPath: string, options?: FsOption) {
		this._path = targetPath;

		if (this.path) {
			this.content = fs.readFileSync(path.resolve(this.path), options);
		}
	}

	get path(): string {
		return this._path;
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

	public write(options?: fs.WriteFileOptions): void {
		if (this.isPresent) {
			fs.writeFileSync(path.resolve(this.path), this.content, options);
		}
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

	public static getExtension(targetPath: string): string {
		return path.extname(targetPath).replace(".", "");
	}

	public static getChldrens(
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
		const filters   = Optional.ofNullable(options?.filters).orElseNonNullable([]);
		const filtering = filters ? true : false;
		const fullPath  = Optional.ofNullable(options?.fullPath).orElseNonNullable(false);
		const recursive = Optional.ofNullable(options?.recursive).orElseNonNullable(false);
		const dirents   = fs.readdirSync(targetPath, { withFileTypes: true });

		let   result    = this.getFiles(targetPath, dirents, filters, filtering, fullPath);

		if (recursive) {
			this.getDirectories(targetPath, dirents).forEach((value) => { result = result.concat(File.getChildren(value, options)); });
		}

		return result;
	}

	private static getFiles(
		targetPath: string,
		dirents:    fs.Dirent[],
		filters:    Array<string>,
		filtering:  boolean,
		fullPath:   boolean
	): string[] {
		return dirents
				.filter((dirent) => { return dirent.isFile() && (filters.includes(File.getExtension(dirent.name)) || !filtering); }
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
