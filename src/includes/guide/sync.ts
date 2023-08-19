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
import { Optional }         from "../utils/base/optional";
import * as Encrypt         from "../utils/base/encrypt";
import { messages, values } from "../constant";

export class SyncImageFilePathGuide extends InputResourceGuide {
	constructor(
		state: State,
	) {
		super(state, Type.File);

		this.itemId         = this.itemIds.filePath;
		this.prompt         = messages.placeholder.sync.upload.filePath;
		this.state.validate = SyncImageFilePathGuide.validateFilePath;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		do {
			if (
				this.inputValueAsString.length > 0
				&& File.isFile(this.inputValueAsString)
				&& SyncImageFilePathGuide.isNotApplyFileSize(File.getFilesize(this.inputValueAsString))
			) {
				window.showWarningMessage(messages.validate.sync.size);
			}
			await super.show(input);
		} while (
			SyncImageFilePathGuide.isNotApplyFileSize(
				File.getFilesize(this.guideGroupResultSet[this.itemId] as string))
		);
	}

	public static async validateFilePath(value: string): Promise<string | undefined> {
		const filePath = File.normalize(value);

		if (!File.isFile(filePath)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve(messages.validate.file.invalid);
			});
		} else if (
			SyncImageFilePathGuide.isNotApplyFileSize(
				File.getFilesize(filePath)
			)
		) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve(messages.validate.sync.size);
			});
		} else {
			return undefined;
		}
	}

	private static isNotApplyFileSize(size: number | boolean): boolean {
		return (typeof size === "boolean" || (typeof size === "number" && size > values.sync.limit.size)) ? true : false;
	}
}

export class BaseSyncSaltInputGuide extends BaseInputGuide {
	constructor(
		state: State,
	) {
		super(state);

		this.itemId         = "salt";
		this.state.validate = BaseValidator.validateRequired;
	}
}

export class SyncEncryptSaltInputGuide extends BaseSyncSaltInputGuide {
	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.setResultSet(Encrypt.randomBytes(16).toString('base64'));

		await super.show(input);
	}

	protected async lastInputStepExecute(): Promise<void> {
		const [iv, data]   = this.getSyncData;
		const inputOpacity = Optional.ofNullable(this.guideGroupResultSet[this.itemIds.opacity]).orElseNonNullable("") as string;
		const opacity      = inputOpacity ? parseFloat(inputOpacity) : 0.75

		await this.sync.setData(iv.toString("base64"), data.toString("base64"));
		await this.sync.setOpacity(opacity);

		this.state.message = messages.showInformationMessage.sync.success.upload;
	}

	private get getSyncData(): [Buffer, Buffer] {
		const file = new File(File.normalize(this.guideGroupResultSet[this.itemIds.filePath] as string));
		const data = Buffer.from(`data:image/${file.extension};base64,${file.toBase64()}`);

		return Encrypt.encrypt(
			data,
			this.guideGroupResultSet["password"] as string,
			this.guideGroupResultSet[this.itemId] as string
		);
	}
}

export class SyncDecryptSaltInputGuide extends BaseSyncSaltInputGuide {
	private data:    string | undefined = undefined;
	private opacity: number | undefined = undefined;

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		do {
			if (this.data && this.opacity) {
				window.showWarningMessage(messages.showInformationMessage.sync.warning.download);
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
		this.installer.installFromSync(this.data ?? "", this.opacity ?? 0.75);
		this.state.reload = true;
	}

	private getDecryptedData(iv: string, encrypted: string, password: string, salt: string): Buffer {
		return Encrypt.decrypt(iv, encrypted, password, salt);
	}
}
