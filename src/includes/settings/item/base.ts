import { AbstractSettingItem } from "./abc";

export class BaseSettingItem<T extends (string | Record<string, unknown> | [] | undefined)> extends AbstractSettingItem {
	constructor(
		itemId:       string,
		value:        T,
		defaultValue: T
	) {
		super(itemId, value, defaultValue);
	}

	public get convert4Registration(): T {
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
		super(itemId, value, defaultValue);
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
		super(itemId, value, defaultValue);
		this._trueValue  = trueValue;
		this._falseValue = falseValue;
	}

	public set value(value: any) {
		if (typeof(value) === "string") {
			super.value = value === this._trueValue ? true : false;
		} else if (typeof(value) === "boolean") {
			super.value = value;
		}
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
