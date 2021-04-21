type Nullable<T> = T | null | undefined;

export class Optional<T> {
	private value: Nullable<T>;

	constructor(value: Nullable<T>) {
		this.value = value;
	}

	public static empty<T>(): Optional<T> {
		return new Optional<T>(null);
	}

	public static ofNullable<T>(value: Nullable<T>): Optional<T> {
		return new Optional<T>(value);
	}

	public orElseNonNullable(other: NonNullable<T>): NonNullable<T> {
		return (this.value !== null && this.value !== undefined ? this.value : other) as NonNullable<T>;
	}
}
