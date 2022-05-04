import { window }           from "vscode";
import {
	InputStep,
	MultiStepInput
}                           from "../utils/multiStepInput";
import { State }            from "./base/base";
import {
	BaseInputGuide,
	InputResourceGuide,
	Type
}                           from "./base/input";
import { BaseValidator }    from "./validator/base";
import { File }             from "../utils/base/file";
import * as Encrypt         from "../utils/base/encrypt";
import * as Constant        from "../constant";

const warning = `The image file size that can be sync is less than ${Constant.syncImageSize4Display}.`;

export class SyncImageFilePathGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		super(state, Type.File);

		this.itemId         = this.itemIds.filePath;
		this.prompt         = "Enter the path of the image file you want to sync as the wallpaper, or select it from the file dialog that appears by clicking the button on the upper right.";
		this.state.validate = SyncImageFilePathGuide.validateFilePath;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		do {
			if (
				this.inputValueAsString.length > 0
				&& File.isFile(this.inputValueAsString)
				&& SyncImageFilePathGuide.isNotApplyFileSize(File.getFilesize(this.inputValueAsString))
			) {
				window.showWarningMessage(warning);
			}
			await super.show(input);
		} while (
			SyncImageFilePathGuide.isNotApplyFileSize(
				File.getFilesize(this.guideGroupResultSet[this.itemId] as string))
		);
	}

	public static async validateFilePath(filePath: string): Promise<string | undefined> {
		if (!File.isFile(filePath)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Invalid path.");
			});
		} else if (
			SyncImageFilePathGuide.isNotApplyFileSize(
				File.getFilesize(filePath)
			)
		) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve(warning);
			});
		} else {
			return undefined;
		}
	}

	private static isNotApplyFileSize(size: number | boolean): boolean {
		return (!size || (size && size > Constant.syncImageSize)) ? true : false;
	}
}

export class SyncPasswordInputGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		super(state);

		this.itemId         = "password";
		this.state.validate = BaseValidator.validateRequired;
	}
}

export class SyncEncryptSaltInputGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		super(state);

		this.itemId         = "salt";
		this.prompt         = "Please note the displayed salt or enter the salt.";
		this.state.validate = BaseValidator.validateRequired;
	}

	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.setResultSet(Encrypt.randomBytes(16).toString('base64'));

		await super.show(input);
	}

	protected async lastInputStepExecute(): Promise<void> {
		const [iv, data] = this.getSyncData;

		await this.sync.setData(iv.toString("base64"), data.toString("base64"));
		await this.sync.setOpacity(parseFloat(this.guideGroupResultSet[this.itemIds.opacity] as string));

		this.state.message = "Wallpaper settings uploaded!"
	}

	private get getSyncData(): [Buffer, Buffer] {
		const file = new File(this.guideGroupResultSet[this.itemIds.filePath] as string);
		const data = Buffer.from(`data:image/${file.extension};base64,${file.toBase64()}`);

		return Encrypt.encrypt(
			data,
			this.guideGroupResultSet["password"] as string,
			this.guideGroupResultSet[this.itemId] as string
		);
	}
}

export class SyncDecryptSaltInputGuide extends BaseInputGuide {
	private data:    string | undefined = undefined;
	private opacity: number | undefined = undefined;

	constructor(
		state: State,
	) {
		super(state);

		this.itemId         = "salt";
		this.prompt         = "Enter the salt used to decrypt the image data.";
		this.state.validate = BaseValidator.validateRequired;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		do {
			if (this.data && this.opacity) {
				window.showWarningMessage(`The decryption result was not in the expected format. Please check password and salt.`);
			}

			await super.show(input);

			this.data    = (this.getDecryptedData(
				...this.sync.getData,
				this.guideGroupResultSet["password"] as string,
				this.guideGroupResultSet[this.itemId] as string
			)).toString("utf8");

			this.opacity = this.sync.getOpacity;

		} while (this.data && !(0 === this.data.indexOf("data:image/")));
	}

	protected async lastInputStepExecute(): Promise<void> {
		this.installer.install(true, this.data, this.opacity);
		this.state.reload = true;
	}

	private getDecryptedData(iv: string, encrypted: string, password: string, salt: string): Buffer {
		return Encrypt.decrypt(iv, encrypted, password, salt);
	}
}
