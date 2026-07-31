const reportsService = require("../services/reports.service");
const { validateReport } = require("../middleware/validation");

async function getAll(req, res) {
	res.json(await reportsService.getAll());
}

//call correct service function
async function getById(req, res) {
	res.json(await reportsService.getById(req.params.id));
}

//check for validation errors
async function create(req, res) {
	const { errors, value } = validateReport(req.body);
	if (errors.length > 0) {
		res.status(400).json({ errors });
		return;
	}
	//create new report
	res.status(201).json(await reportsService.create(value));
}

module.exports = { getAll, getById, create };
