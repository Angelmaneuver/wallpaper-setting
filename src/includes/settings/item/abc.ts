export abstract class AbstractSettingItem {
	protected _itemId = "";
	protected _value:        any = undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
	protected _defaultValue: any = undefined; // eslint-disable-line @typescript-eslint/no-explicit-any

	constructor(itemId: string, value: unknown, defaultValue: unknown) {
		this._itemId       = itemId;
		this._value        = value;
		this._defaultValue = defaultValue;
	}

	public abstract get convert4Registration(): unknown;

	public get itemId(): string {
		return this._itemId;
	}

	/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public set value(value: any) {
		this._value = value;
	}
	/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get value(): any {
		return this._value;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get defaultValue(): any {
		return this._defaultValue;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public get validValue(): any {
		return this.convert4Registration ? this.convert4Registration : this._defaultValue;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected checkDefault(): any {
		return this._value === this._defaultValue ? undefined : this._value;
	}
}
