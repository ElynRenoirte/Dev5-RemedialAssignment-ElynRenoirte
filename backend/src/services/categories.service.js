const categoriesRepository = require("../repositories/categories.repository");
const { httpError } = require("../utils/httpError");

async function getAll() {
	return categoriesRepository.findAll();
}

async function create(name) {
	if (await categoriesRepository.findByName(name)) {
		throw httpError(409, "This category already exists");
	}
	return categoriesRepository.create(name);
}

module.exports = { getAll, create };
