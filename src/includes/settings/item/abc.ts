export abstract class AbstractSettingItem {
	protected _itemId:       string = "";
	protected attribute:     string = "";
	private   _value:        string | undefined = undefined;
	protected _defaultValue: string | undefined = undefined;

	constructor(
		itemId:       string,
		attribute:    string,
		value:        any,
		defaultValue: any
	) {
		this._itemId       = itemId;
		this.attribute     = attribute;
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
	};

	protected checkDefault(): void {
		this.value = this.value === this.defaultValue ? undefined : this.value;
	}
}
