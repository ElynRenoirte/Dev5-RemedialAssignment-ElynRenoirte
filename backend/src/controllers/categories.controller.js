const categoriesService = require("../services/categories.service");
const { validateCategory } = require("../middleware/validation");

//call correct service function
async function getAll(req, res) {
	res.json(await categoriesService.getAll());
}

//check for validation errors
async function create(req, res) {
	const { errors, value } = validateCategory(req.body);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	//create new category
	res.status(201).json(await categoriesService.create(value.name));
}

module.exports = { getAll, create };
