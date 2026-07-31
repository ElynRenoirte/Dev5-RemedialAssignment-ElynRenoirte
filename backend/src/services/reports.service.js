const reportsRepository = require("../repositories/reports.repository");
const usersRepository = require("../repositories/users.repository");
const categoriesRepository = require("../repositories/categories.repository");
const personsService = require("./persons.service");
const { httpError } = require("../utils/httpError");

async function getAll() {
	return reportsRepository.findAll();
}

async function getById(id) {
	const report = await reportsRepository.findById(id);
	if (!report) {
		throw httpError(404, "Report not found");
	}
	return report;
}

// Checks the referenced rows exist before inserting, so bad data never reaches the DB.
async function create(reportData) {
	if (!(await usersRepository.findById(reportData.userId))) {
		throw httpError(400, "Referenced user does not exist");
	}
	if (reportData.categoryId && !(await categoriesRepository.findById(reportData.categoryId))) {
		throw httpError(400, "Referenced category does not exist");
	}

	const person = await personsService.getOrCreate(reportData.personName);

	return reportsRepository.create({
		user_id: reportData.userId,
		category_id: reportData.categoryId,
		person_id: person.id,
		description: reportData.description,
		latitude: reportData.latitude,
		longitude: reportData.longitude,
		direction: reportData.direction,
	});
}

module.exports = { getAll, getById, create };
