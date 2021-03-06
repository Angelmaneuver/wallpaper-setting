import { File }      from "../../utils/base/file";
import * as Constant from "../../constant";
import { Optional }  from "../../utils/base/optional";

export class BaseValidator {
	public static async validateFileExist(filePath: string): Promise<string | undefined> {
		if (!File.isFile(filePath, Constant.applyImageFile)) {
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
}
