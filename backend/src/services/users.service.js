const usersRepository = require("../repositories/users.repository");
const reportsRepository = require("../repositories/reports.repository");
const { httpError } = require("../utils/httpError");

async function getAll() {
	return usersRepository.findAll();
}

async function getById(id) {
	const user = await usersRepository.findById(id);
	if (!user) {
		throw httpError(404, "User not found");
	}
	return user;
}

async function create(userData) {
	if (await usersRepository.findByEmail(userData.email)) {
		throw httpError(409, "A user with this email already exists");
	}
	return usersRepository.create(userData);
}

async function getReports(id) {
	await getById(id);
	return reportsRepository.findByUser(id);
}

module.exports = { getAll, getById, create, getReports };
