//receive http requests, send http responses
const usersService = require("../services/users.service");
const { validateUser } = require("../middleware/validation");

async function getAll(req, res) {
	res.json(await usersService.getAll());
}

//call correct service function
async function getById(req, res) {
	res.json(await usersService.getById(req.params.id));
}

//check for validation errors
async function create(req, res) {
	const { errors, value } = validateUser(req.body);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	//create the user
	res.status(201).json(await usersService.create(value));
}

async function getReports(req, res) {
	res.json(await usersService.getReports(req.params.id));
}

module.exports = { getAll, getById, create, getReports };
