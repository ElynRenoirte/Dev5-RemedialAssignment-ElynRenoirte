const categoriesService = require("../services/categories.service");
const { validateCategory } = require("../middleware/validation");

async function getAll(req, res) {
	res.json(await categoriesService.getAll());
}

async function create(req, res) {
	const { errors, value } = validateCategory(req.body);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	res.status(201).json(await categoriesService.create(value.name));
}

module.exports = { getAll, create };
