//hashes and verifies passwords 
const crypto = require("crypto");

const KEY_LENGTH = 64;

function hashPassword(password) {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(16).toString("hex");
		crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(`${salt}:${derivedKey.toString("hex")}`);
		});
	});
}

function verifyPassword(password, storedHash) {
	return new Promise((resolve, reject) => {
		if (!storedHash || !storedHash.includes(":")) {
			resolve(false);
			return;
		}
		const [salt, key] = storedHash.split(":");
		crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
			if (err) {
				reject(err);
				return;
			}
			const expected = Buffer.from(key, "hex");
			const actual = derivedKey;
			resolve(expected.length === actual.length && crypto.timingSafeEqual(expected, actual));
		});
	});
}

module.exports = { hashPassword, verifyPassword };
