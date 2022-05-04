import * as crypto from "crypto";

const algorithm = "aes-256-ctr";

export function randomBytes(size: number): Buffer {
	return crypto.randomBytes(size);
}

export function encrypt(data: Buffer, password: string, salt: string): [Buffer, Buffer] {
	const key       = crypto.scryptSync(password, salt, 32);
	const iv        = crypto.randomBytes(16);
	const ciper     = crypto.createCipheriv(algorithm, key, iv);
	const encrypted = ciper.update(data);

	ciper.final();

	return [iv, encrypted];
}

export function decrypt(iv: string, encrypted: string, password: string, salt: string): Buffer {
	const key     = crypto.scryptSync(password, salt, 32);
	const deciper = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "base64"));
	const data    = deciper.update(Buffer.from(encrypted, "base64"));

	deciper.final();

	return data;
}
