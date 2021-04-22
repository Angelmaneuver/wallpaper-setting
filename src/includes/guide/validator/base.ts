import { File }      from "../../utils/base/file";
import * as Constant from "../../constant";
import { Optional }  from "../../utils/base/optional";

export class BaseValidator {
	public static async validateFileExist(filePath: string): Promise<string | undefined> {
		if (!File.isFile(filePath, Constant.applyImageFile)) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve("Invalid path.");
				}
			);
		} else {
			return undefined;
		}
	}

	public static async validateDirectoryExist(filePath: string): Promise<string | undefined> {
		if (!File.isDirectory(filePath)) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve("Invalid path.");
				}
			);
		} else {
			return undefined;
		}
	}

	public static async validateRequired(value: string): Promise<string | undefined> {
		if (!(value) || value.length === 0) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve("Required field.");
				}
			);
		} else {
			return undefined;
		}
	}

	public static async validateNumber(
		name:     string,
		value:    string,
		options?: { minimum?: number; maximum?: number; }
	): Promise<string | undefined> {
		let minimum: number = Optional.ofNullable(options?.minimum).orElseNonNullable(0);
		let maximum: number = Optional.ofNullable(options?.maximum).orElseNonNullable(65555);
		let string2Number   = Number(value);

		if (
			(value.length > 0 && !isNaN(string2Number)) &&
			(string2Number > maximum || string2Number < minimum)
		) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve(`Enter a number between ${minimum} and ${maximum} for ${name}.`);
				}
			);

		} else {
			return undefined;
		}
	}
}
