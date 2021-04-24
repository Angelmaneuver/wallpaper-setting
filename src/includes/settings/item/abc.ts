export abstract class AbstractSettingItem {
	protected _itemId = "";
	private   _value:        any = undefined;
	protected _defaultValue: any = undefined;

	constructor(
		itemId:       string,
		value:        any,
		defaultValue: any
	) {
		this._itemId       = itemId;
		this._value        = value;
		this._defaultValue = defaultValue;
	}

	public abstract get convert4Registration(): any;

	public get itemId(): string {
		return this._itemId;
	}

	public set value(value: any) {
		this._value = value;
	}

	public get value(): any {
		return this._value;
	}

	public get defaultValue(): any {
		return this._defaultValue;
	}

	public get validValue(): any {
		return this.convert4Registration ? this.convert4Registration : this.defaultValue;
	}

	protected checkDefault(): void {
		this.value = this.value === this.defaultValue ? undefined : this.value;
	}
}
