import { File }     from "../../utils/base/file";
import { Constant } from "../../constant";

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
		options?: {
			minimum?: number;
			maximum?: number;
		}
	): Promise<string | undefined> {
		let minimum: number = 0;
		let maximum: number = 65555;

		if (options) {
			minimum = options.minimum ? options.minimum : minimum;
			maximum = options.maximum ? options.maximum : maximum;
		}

		let string2Number   = Number(value);

		if (!value || (string2Number >= minimum && string2Number <= maximum)) {
			return undefined;
		} else if (
			isNaN(string2Number) ||
			string2Number > maximum ||
			string2Number < minimum
		) {
			return new Promise<string>(
				(resolve, reject) => {
					resolve(
						"Enter a number between " +
							minimum +
							" and " +
							maximum +
							" for " +
							name +
							"."
					);
				}
			);
		} else {
			return undefined;
		}
	}
}
