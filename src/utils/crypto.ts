// PBKDF2(SHA-256) через WebCrypto, хранение hex-строк


function toHex(buf: ArrayBuffer) {
	return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}


export function randomSalt(bytes = 16): string {
	const arr = new Uint8Array(bytes);
	crypto.getRandomValues(arr);
	return toHex(arr.buffer);
}


export async function hashPassword(password: string, saltHex: string, iterations = 100_000): Promise<string> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
	const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(h => parseInt(h, 16)));
	const bits = await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', iterations, salt}, keyMaterial, 256);
	return toHex(bits);
}
