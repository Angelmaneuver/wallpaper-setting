import { AbstractSettingItem } from "./abc";

export class BaseSettingItem<T extends (string | Record<string, unknown> | [] | undefined)> extends AbstractSettingItem {
	constructor(itemId: string, value: T, defaultValue: T) {
		super(itemId, value, defaultValue);
	}

	protected checkDefault(): T {
		let value = super.checkDefault();

		if (value && typeof(value) !== "string") {
			value = Object.keys(value).length > 0 ? value : undefined;
		}

		return value;
	}

	public get convert4Registration(): T {
		return this.checkDefault();
	}
}

export class NumberSettingItem extends AbstractSettingItem {
	constructor(
		itemId:       string,
		value:        number | undefined,
		defaultValue: number | undefined
	) {
		super(itemId, value, defaultValue);
	}

	public set value(value: unknown) {
		if (typeof(value) === "number") {
			this._value = value;
		} else {
			let converted = Number(value);
			converted     = typeof(value) === "string" && value.length === 0 ? this._defaultValue : converted;
			this._value   = isNaN(converted) ? this._defaultValue : converted;
		}
	}

	public get value(): unknown {
		return this._value;
	}

	public get convert4Registration(): number | undefined {
		return this.checkDefault();
	}
}

export class BooleanSettingItem extends AbstractSettingItem {
	protected _trueValue:  string;
	protected _falseValue: string;

	constructor(
		itemId:       string,
		value:        boolean,
		defaultValue: boolean,
		trueValue:    string,
		falseValue:   string
	) {
		super(itemId, value, defaultValue);
		this._trueValue  = trueValue;
		this._falseValue = falseValue;
	}

	protected checkDefault(): boolean | undefined {
		return this._value === this.defaultValue ? undefined : this._value;
	}

	public set value(value: unknown) {
		if (typeof(value) === "string") {
			this._value = value === this._trueValue ? true : false;
		} else if (typeof(value) === "boolean") {
			this._value = value;
		} else {
			throw new TypeError("Requested parameter type " + typeof(value) + " not support with this setter...");
		}
	}

	public get value(): unknown {
		return this._value ? this._trueValue : this._falseValue;
	}

	public get valueAsString(): string {
		return this.value as string
	}

	public get validValue(): boolean {
		return this.convert4Registration === undefined ? this._defaultValue : this.convert4Registration;
	}

	public get convert4Registration(): boolean | undefined {
		return this.checkDefault();
	}

	public get trueValue(): string {
		return this._trueValue;
	}

	public get falseValue(): string {
		return this._falseValue;
	}
}
