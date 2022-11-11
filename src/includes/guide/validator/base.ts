import { File }      from "../../utils/base/file";
import { Optional }  from "../../utils/base/optional";

const HEX_COLOR_CODE_MATCHER = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export class BaseValidator {
	public static filters: Array<string> | undefined = undefined;

	public static async validateFileExist(filePath: string): Promise<string | undefined> {
		if (!File.isFile(filePath, BaseValidator.filters)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Invalid path.");
			});
		} else {
			return undefined;
		}
	}

	public static async validateDirectoryExist(filePath: string): Promise<string | undefined> {
		if (!File.isDirectory(filePath)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Invalid path.");
			});
		} else {
			return undefined;
		}
	}

	public static async validateRequired(value: string): Promise<string | undefined> {
		if (!(value) || value.length === 0) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Required field.");
			});
		} else {
			return undefined;
		}
	}

	public static async validateNumber(
		name:     string,
		value:    string,
		options?: { minimum?: number; maximum?: number; }
	): Promise<string | undefined> {
		const minimum: number = Optional.ofNullable(options?.minimum).orElseNonNullable(0);
		const maximum: number = Optional.ofNullable(options?.maximum).orElseNonNullable(65555);
		const string2Number   = Number(value);

		if (value.length > 0 && (isNaN(string2Number) || string2Number > maximum || string2Number < minimum)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve(`Enter a number between ${minimum} and ${maximum} for ${name}.`);
			});
		} else {
			return undefined;
		}
	}

	public static async validateHexColorCode(value: string): Promise<string | undefined> {
		if (HEX_COLOR_CODE_MATCHER.test(value)) {
			return undefined;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Invalid value.");
			});
		}
	}
}
