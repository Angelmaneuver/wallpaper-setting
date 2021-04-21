export class Optional<T> {
	constructor(private value: T | undefined) {}

	public static empty<T>(): Optional<T> {
		return new Optional<T>(undefined);
	}

	public static of<T>(value: T): Optional<T> {
		return new Optional<T>(value);
	}

	public static ofNullable<T>(value: T): Optional<T> {
		return new Optional<T>(value);
	}

	public orElseNonNullable(other: NonNullable<T>): NonNullable<T> {
		return (this.value !== null && this.value !== undefined ? this.value : other) as NonNullable<T>;
	}
}
