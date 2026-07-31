const personsService = require("../services/persons.service");
const { validatePerson } = require("../middleware/validation");

async function getAll(req, res) {
	res.json(await personsService.getAll());
}

async function getById(req, res) {
	res.json(await personsService.getById(req.params.id));
}

async function create(req, res) {
	const { errors, value } = validatePerson(req.body);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	res.status(201).json(await personsService.create(value.name));
}

async function getTrajectory(req, res) {
	res.json(await personsService.getTrajectory(req.params.id));
}

module.exports = { getAll, getById, create, getTrajectory };
