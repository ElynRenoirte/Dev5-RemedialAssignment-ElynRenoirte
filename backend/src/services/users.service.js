//contains application logic, how it gets/saves data in mysql
const usersRepository = require("../repositories/users.repository");
const reportsRepository = require("../repositories/reports.repository");
const { hashPassword, verifyPassword } = require("../utils/password");
const { httpError } = require("../utils/httpError");

//get all users
async function getAll() {
	return usersRepository.findAll();
}

//get a user and throw 404 if missing
async function getById(id) {
	const user = await usersRepository.findById(id);
	if (!user) {
		throw httpError(404, "User not found");
	}
	return user;
}

//prevent duplicate emails, then create user
async function create(userData) {
	if (await usersRepository.findByEmail(userData.email)) {
		throw httpError(409, "A user with this email already exists");
	}
	return usersRepository.create(userData);
}

//Verify user exists, then get their reports
async function getReports(id) {
	await getById(id);
	return reportsRepository.findByUser(id);
}

//log in by name and password; registers the account on first login
async function login(name, password) {
	const existing = await usersRepository.findByName(name);
	if (existing) {
		const valid = await verifyPassword(password, existing.password_hash);
		if (!valid) {
			throw httpError(401, "Invalid name or password");
		}
		const { password_hash, ...user } = existing;
		return user;
	}
	const passwordHash = await hashPassword(password);
	return usersRepository.create({ name, passwordHash });
}

module.exports = { getAll, getById, create, getReports, login };
