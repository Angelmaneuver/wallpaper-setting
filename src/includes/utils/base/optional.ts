export class Optional {
	private _value: any;

	constructor(value?: any) {
		this._value = value;
	}

	public set value(value: any) {
		this._value = value;
	}

	public get value(): any {
		return this._value;
	}

	public set(value: any): Optional {
		this._value = value;
		return this;
	}

	public orElse(value: any): any {
		return this._value ? this._value : value;
	}
}
