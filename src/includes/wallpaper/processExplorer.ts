import { AbstractWallpaper } from "./abc";
import { ExtensionSetting }  from "../settings/extension";
import { formatByArray }     from "../utils/base/string";
import { File }              from "../utils/base/file";

export class ProcessExplorer extends AbstractWallpaper {
	private _colorCode: string | undefined = undefined;

	constructor(
		destination:  string,
		settings:     ExtensionSetting,
		extensionKey: string,
	) {
		super(destination, settings, extensionKey);
	}

	protected checkIsReady(): undefined {
		return undefined;
	}

	protected checkIsAutoSet(): undefined {
		return undefined;
	}

	public install(): void {
		if (!this.colorCode || ('string' === typeof this.colorCode && 0 === this.colorCode.length)) {
			return;
		}

		const editFile   = new File(this.destination);

		editFile.content = this.clearWallpaperScript(editFile.toString()) + formatByArray(this.getScriptTemplate(0), "");

		editFile.write();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected getBasicStyle(opacity: number): string {
		return `body{background-color:${this.colorCode};}`;
	}

	public set colorCode(colorCode: string | undefined) {
		this._colorCode = colorCode;
	}

	public get colorCode() {
		return this._colorCode;
	}
}
