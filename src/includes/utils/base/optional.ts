import * as Types from "./type";

export class Optional<T> {
	private value: Types.Nullable<T>;

	constructor(value: Types.Nullable<T>) {
		this.value = value;
	}

	public static empty<T>(): Optional<T> {
		return new Optional<T>(null);
	}

	public static ofNullable<T>(value: Types.Nullable<T>): Optional<T> {
		return new Optional<T>(value);
	}

	public isPresent(): boolean {
		return this.value !== null && this.value !== undefined ? true : false;
	}

	public orElseNullable(other: Types.Nullable<T>): Types.Nullable<T> {
		return this.isPresent() ? this.value : other;
	}

	public orElseNonNullable(other: NonNullable<T>): NonNullable<T> {
		return (this.isPresent() ? this.value : other) as NonNullable<T>;
	}

	public orElseThrow(error: Error): NonNullable<T> {
		if (this.value !== null && this.value !== undefined) {
			return this.value as NonNullable<T>;
		} else {
			throw error;
		}
	}
}
