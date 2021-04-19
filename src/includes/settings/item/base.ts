import { AbstractSettingItem } from "./abc";

export const BaseAttribute = {
	String:  "string",
	Number:  "number",
	Boolean: "boolean",
	Array:   "array",
	Object:  "Object"
}

export class StringSettingItem extends AbstractSettingItem {
	constructor(
		itemId:       string,
		value:        string | undefined,
		defaultValue: string | undefined
	) {
		super(itemId, BaseAttribute.String, value, defaultValue);
	}

	public get convert4Registration(): string | undefined {
		this.checkDefault();
		return this.value;
	}
}

export class NumberSettingItem extends AbstractSettingItem {
	constructor(
		itemId:       string,
		value:        string | undefined,
		defaultValue: string | undefined
	) {
		super(itemId, BaseAttribute.Number, value, defaultValue);
	}

	public get convert4Registration(): number | undefined {
		this.checkDefault();
		return this.value ? Number(this.value) : undefined;
	}
}

export class BooleanSettingItem extends AbstractSettingItem {
	protected _trueValue:  string;
	protected _falseValue: string;

	constructor(
		itemId:       string,
		value:        any,
		defaultValue: boolean,
		trueValue:    string,
		falseValue:   string
	) {
		super(itemId, BaseAttribute.Boolean, value, defaultValue);
		this._trueValue  = trueValue;
		this._falseValue = falseValue;
	}

	public set value(value: any) {
		super.value = value === this._trueValue ? true : false;
	}

	public get value(): any {
		return super.value ? this._trueValue : this._falseValue;
	}

	public get validValue(): boolean {
		return this.convert4Registration === undefined ? this.defaultValue : this.convert4Registration;
	}

	public get convert4Registration(): boolean | undefined {
		this.checkDefault();
		return super.value;
	}
}

export class ArraySettingItem extends AbstractSettingItem {
	constructor(
		itemId:       string,
		value:        [] | undefined,
		defaultValue: [] | undefined,
	) {
		super(itemId, BaseAttribute.Array, value, defaultValue);
	}

	public get convert4Registration(): [] | undefined {
		this.checkDefault();
		return this.value ? this.value : undefined;
	}
}

export class ObjectSettingItem extends AbstractSettingItem {
	constructor(
		itemId:       string,
		value:        any,
		defaultValue: any,
	) {
		super(itemId, BaseAttribute.Object, value, defaultValue);
	}

	public get convert4Registration(): any {
		this.checkDefault();
		return this.value ? this.value : undefined;
	}
}
