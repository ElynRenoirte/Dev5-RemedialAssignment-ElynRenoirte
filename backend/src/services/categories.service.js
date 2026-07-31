const categoriesRepository = require("../repositories/categories.repository");
const { httpError } = require("../utils/httpError");

//get all categories
async function getAll() {
	return categoriesRepository.findAll();
}

//get a category and throw error if it already exists
async function create(name) {
	if (await categoriesRepository.findByName(name)) {
		throw httpError(409, "This category already exists");
	}
	return categoriesRepository.create(name);
}

module.exports = { getAll, create };
